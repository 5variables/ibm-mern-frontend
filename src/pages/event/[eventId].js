import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import './view-event-style.css';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import 'mapbox-gl/dist/mapbox-gl.css';

const EventId = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  const sign = "<--";


  const router = useRouter();
  const [eventId, setEventId] = useState("");
  const { id } = router.query;
  const [user, setUser] = useState();
  const [event, setEvent] = useState(null);

  const isUserInvited = () => {
    if (event && user) {
        return event.invitations.includes(user.mail);
    }
    return false;
  };

  const isUserConfirmed = () => {
      if (event && user) {
        // console.log(user.mail);
        // console.log(event.participants);
        return event.participants.includes(user.mail);
    }
    return false;
  };

  useEffect(() => {
    const checkToken = async () => {
      // check if token exists in localStorage
      const token = localStorage.getItem("token");

      if (!token) {
        // redirect to RegisterPage if token doesn't exist
        router.push("/register/new-user");
      } else {
        // verify user with token
        try {
          const response = await axios.post("http://localhost:3001/register/verify-token", {
            token: token,
          });

          setUser(response.data.user);
        } catch (error) {
          console.error(error);
        }
      }
    };

    checkToken();
  }, []);

  useEffect(() => {

    mapboxgl.accessToken = 'pk.eyJ1IjoicnViaWM0IiwiYSI6ImNrY3Vla3R1ZjF0YnYyeXQ2c243eWVpeHEifQ.Hgj0BjhuuOAowR_pE97V_Q';

    if (!map.current && mapContainer.current)  {
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/rubic4/clk5n3pvd00j501pe0juiej4p',
          center: [21, 44],
          zoom: 1
      });
    }

    map.current.on('load', function () {
        map.current.resize();
    });
    
  }, []);

  useEffect(() => {
        if (event) {
            const { coordinates } = event.location;
            const [lng, lat] = coordinates; 

            const markerElement = document.createElement('div');
            markerElement.className = 'custom-marker';
            markerElement.style.backgroundColor = 'black';
            markerElement.style.color = 'white';
            markerElement.style.width = 'fit-content';
            markerElement.style.paddingRight = '20px';
            markerElement.style.paddingLeft = '20px';
            markerElement.style.height = '40px';
            markerElement.style.borderRadius = '50px';
            markerElement.style.display = 'flex';
            markerElement.style.justifyContent = 'center';
            markerElement.style.alignItems = 'center';
            markerElement.innerText = event.title;

            new mapboxgl.Marker({ element: markerElement })
                .setLngLat([lat, lng])
                .addTo(map.current);

            map.current.setZoom(16);
            map.current.setCenter([lat, lng]);
        }
    
  }, [event])

  useEffect(() => {
    setEventId(id);
    const url = window.location.href.split("/");
    setEventId(url[url.length - 1]);
    
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:3001/events/get-all");
        const events = response.data;
        const eventWithId = events.find((event) => event._id === eventId);

        if (eventWithId) {
          setEvent(eventWithId);
        } else {
          setEvent(null);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchEvents();
  }, [eventId]);

  const confirmParticipation = async () => {
    try {
        const res = await axios.post('http://localhost:3001/events/attend/'+event._id+'/'+user.mail);
        location.reload();
    } catch(error) {
        console.error(error);
    }
  }

  function convertToRomaniaTime(utcTimeString) {
    const utcDate = new Date(utcTimeString);
    
    // Get the Romania time offset from UTC (in minutes) which is 3 hours ahead (180 minutes)
    const romaniaTimeOffset = 180;
    
    // Calculate the Romania time by adding the offset to the UTC time
    const romaniaTime = new Date(utcDate.getTime() + romaniaTimeOffset * 60000);
  
    // Get the hours and minutes from the Romania time
    const hours = romaniaTime.getUTCHours().toString().padStart(2, '0');
    const minutes = romaniaTime.getUTCMinutes().toString().padStart(2, '0');
  
    // Combine hours and minutes in "hh:mm" format
    const romaniaTimeHHMM = `${hours}:${minutes}`;
  
    return romaniaTimeHHMM;
  }

  return (
    <div className="main-view">
        <div className="buttons">
            <div className="btn" onClick={() => router.push('/')}>{sign} All events</div>
            {isUserConfirmed() ? (
                <div>You already confirmed!</div>
            ): isUserInvited() ? <div className="btn" onClick={confirmParticipation}>Confirm</div>
            : <div className="btn" onClick={confirmParticipation}>Attend</div>
            }
        </div>
      {event ? (
        <div className="view-event">
            <div className="top">
                <div className="title">{event.title}</div>
                <div>at</div>
                <div>{event.location.name}</div>
            </div>
            <div className="description"><i>{event.description}</i></div>
            <div>{convertToRomaniaTime(event.date)}</div>
            <div>Participants:</div>
            <div className='user-invitations'>
                {event.participants.map((participant) => (
                    <div  className="participant" key={participant} >
                        <p>{participant}</p>
                    </div>
                ))}
            </div>
        </div>
      ) : (
        <div>No event found</div>
      )}
        <div className='map-container'>
            <div ref={mapContainer} className="map" />
        </div>
    </div>
  );
};

export default EventId;

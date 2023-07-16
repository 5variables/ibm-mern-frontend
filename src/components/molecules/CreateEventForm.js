import { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Input from '@/components/atoms/Input';
import LargeButton from '@/components/atoms/LargeButton';
import './molecules-style.css';
import '../atoms/atoms-style.css';

// import mapboxgl from 'mapbox-gl';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import Autosuggest from 'react-autosuggest';
import 'mapbox-gl/dist/mapbox-gl.css';


const CreateEventForm = () => { 
    const [_lat, setLat] = useState(21.2087);
    const [_lon, setLon] = useState(45.7489);
    const [_zoom, setZoom] = useState(10);
    const [locationName, setLocationName] = useState("");

    const mapContainer = useRef(null);
    const map = useRef(null);
    const router = useRouter();
    const [value, setValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [_coords, setCoords] = useState([]);

    const [eventName, setEventName] = useState('');
    const [description, setDescription] = useState('');

    const [suggestionText, setSuggestionText] = useState('');

    const [users, setUsers] = useState([]);
    const [userName, setUserName] = useState([]);
    const [invitations, setInvitations] = useState([]);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        
        // check if all fields are completed
        if (eventName && description) {
            
            try {
                const response = await axios.post('http://localhost:3001/events/create-event', {
                    title: eventName,
                    description: description,
                    invitations: invitations
                });
                
                location.reload();
            } catch (error) {
                console.error(error);
            }

        } else {
            console.log('Please fill in all fields.');
        }
    };

    const handleInvitationToggle = (mail) => {
        const invitationIndex = invitations.indexOf(mail);
        if (invitationIndex === -1) {
          // Email is not in invitations array, add it
          setInvitations([...invitations, mail]);
        } else {
          // Email is already in invitations array, remove it
          const updatedInvitations = [...invitations];
          updatedInvitations.splice(invitationIndex, 1);
          setInvitations(updatedInvitations);
        }
    };
    
    
    
    useEffect(() => {
        const fetchData = async () => {
            try {
              const res = await axios.get('http://localhost:3001/users/get-all');
              const userData = await Promise.all(
                res.data.map(async (user) => {
                  const groupNames = user.groups.length > 0
                    ? await fetchGroupNames(user.groups)
                    : [];
                  return {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    userMail: user.mail,
                    groups: groupNames
                  };
                })
              );
              setUsers(userData);
            } catch (error) {
              console.error(error);
            }
          };
          
          const fetchGroupNames = async (groupIds) => {
            console.log(groupIds);
            const groupPromises = groupIds.map(async (groupId) => {
              try {
                // console.log(String(groupId));
                const groupRes = await axios.get('http://localhost:3001/groups/get-group-name-from-groupid/'+groupId);
                console.log(groupRes);
                return groupRes.data;
              } catch (error) {
                console.error(`Error fetching group name for groupId: ${groupId}`, error);
                return null; // Handle errors as needed
              }
            });
            return Promise.all(groupPromises);
          };
    
        fetchData();

        mapboxgl.accessToken = 'pk.eyJ1IjoicnViaWM0IiwiYSI6ImNrY3Vla3R1ZjF0YnYyeXQ2c243eWVpeHEifQ.Hgj0BjhuuOAowR_pE97V_Q';

        if (map.current) return; // initialize map only once
          map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/rubic4/clk5n3pvd00j501pe0juiej4p',
            center: [_lat, _lon],
            zoom: _zoom
        });

        map.current.on('load', function () {
            map.current.resize();
        });

    }, [])

    const computeSuggestion = async (value) => {
      try {
        const response = await axios.get(
          `https://geocode.maps.co/search?q=${value}`
        );
        const suggestions = response.data.map((item) => [item.display_name, item.lat, item.lon]);
        // const coords = response.data.map((item) => [item.lat, item.lon]);
        // console.log(coords);
        let name = response.data[0].display_name.split(",")[0];

        const lat = response.data[0].lat;
        const lon = response.data[0].lon;
        

        setLocationName(name);
        setSuggestions(suggestions);

      } catch (error) {
        console.error('Error:', error);
      }
    };

    const clickSuggestion = (suggestion) => {
      // console.log(suggestion);

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
      markerElement.innerText = suggestion[0].split(",")[0];

      const marker = new mapboxgl.Marker({ element: markerElement }).setLngLat([parseFloat(suggestion[2]), parseFloat(suggestion[1])]).addTo(map.current);
      
      map.current.flyTo({
        center: [parseFloat(suggestion[2]), parseFloat(suggestion[1])],
        zoom: 15,
        duration: 3500, // Specify the duration in milliseconds
      });
    }

    return(
        <div className="create-event-form">
            <h1>Create event</h1>
            <form onSubmit={handleFormSubmit}>
                <div className="mid-fields">
                    <Input _onInputChange={(value) => setEventName(value)} _placeholder={"Event title"}/>
                    <Input _onInputChange={(value) => setDescription(value)} _placeholder={"Description"}/>
                    <div className="names">
                        <Input _onInputChange={(value) => setDescription(value)} _placeholder={"Date"}/>
                        <Input _onInputChange={(value) => setDescription(value)} _placeholder={"Time"}/>
                    </div>
                    <div className="suggestions">
                      { 
                        suggestions.map((suggestion) => (
                          suggestionText ? <div className="suggestion" key={suggestion} onClick={() => clickSuggestion(suggestion)}>{suggestion[0]}</div> : ""
                        ))
                      }
                    </div>
                    <Input _onInputChange={(value) => {
                      setSuggestionText(value);
                    }} _placeholder={"Location"}/>
                    <button onClick={() => computeSuggestion(suggestionText)}>Search location</button>
                    
                </div>

                <div className="map-container">
                  <div ref={mapContainer} className="map" />
                </div>

                <h4>Select invitations</h4>
                <div className="users">
                    {users.map((user) => (
                        <div style={{ backgroundColor: invitations.includes(user.userMail) ? 'rgb(0, 0, 0)' : 'rgb(233, 228, 228)', color: invitations.includes(user.userMail) ? 'white' : 'black' }} className="user" key={user.userMail} onClick={() => handleInvitationToggle(user.userMail)}>
                            <p>{user.firstName} {user.lastName} <b>{user.groups.join(", ")}</b></p>
                        </div>
                    ))}
                </div>

                <div className="bottom-fields">
                    <LargeButton _label="Create event -->" _type="submit"/>
                </div>
            </form>
        </div>
    );
}

export default CreateEventForm;
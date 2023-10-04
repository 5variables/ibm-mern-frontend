import './edit-users-style.css';
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Input from '@/components/atoms/Input';



const EditUsers = () => {
    const router = useRouter();

    const [users, setUsers] = useState([]);
    const [editUser, setEditUser] = useState([]);


    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (password) {
            await axios.put('http://localhost:3001/users/update-password/'+editUser[0]+'/'+password);
        }

        if (email) {
            await axios.put('http://localhost:3001/users/update-mail/'+editUser[0]+'/'+email);
        }

        if (firstName) {
            await axios.put('http://localhost:3001/users/update-first-name/'+editUser[0]+'/'+firstName);
        }

        if (lastName) {
            await axios.put('http://localhost:3001/users/update-last-name/'+editUser[0]+'/'+lastName);
        }

        router.refresh();

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
                    groups: groupNames,
                    id: user._id
                  };
                })
              );
              setUsers(userData);
              setEditUser([userData[0].id, userData[0].firstName, userData[0].lastName, userData[0].userMail]);
            } catch (error) {
              console.error(error);
            }
        };
        
        const fetchGroupNames = async (groupIds) => {
        // console.log(groupIds);
        const groupPromises = groupIds.map(async (groupId) => {
            try {
            // console.log(String(groupId));
            const groupRes = await axios.get('http://localhost:3001/groups/get-group-name-from-groupid/'+groupId);
            // console.log(groupRes.data);
            return groupRes.data.name;
            } catch (error) {
            console.error(`Error fetching group name for groupId: ${groupId}`, error);
            return null; // Handle errors as needed
            }
        });
        return Promise.all(groupPromises);
        };
    
        fetchData();
    }, [])

    const handleDelete = async () => {
        if (confirm('Are you sure you want to delete this user?')) {
            // delete it
            await axios.delete('http://localhost:3001/users/delete/'+editUser[0]);

            router.refresh();
          } else {
            // do nothing
          }
    }

    return(
        <div className="eu-main">
            <div className='eu-header'>
                <h1>Edit users</h1>
                <div className="eu-users">
                    {users.map((user) => (
                        <div style={{ backgroundColor: user.id == editUser[0] ? 'rgb(0, 0, 0)' : 'rgb(233, 228, 228)', color: user.id == editUser[0] ? 'white' : 'black' }} className="eu-user" key={user.userMail} onClick={() => setEditUser([user.id, user.firstName, user.lastName, user.userMail])}>
                            <p>{user.firstName} {user.lastName}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className='eu-bottom'>
                <div className="eu-register-form">
                    <form onSubmit={handleFormSubmit}>
                        <div className="eu-mid-fields">
                            <input autoComplete="false" autoCorrect="false" type='text' placeholder={editUser[1]} onChange={(value) => setFirstName(value.target.value)}/>
                            <input autoComplete="false" autoCorrect="false" type='text' placeholder={editUser[2]} onChange={(value) => setLastName(value.target.value)} />
                            <input autoComplete="false" autoCorrect="false" type='text' placeholder={editUser[3]} onChange={(value) => setEmail(value.target.value)}/>
                            <input autoComplete="false" autoCorrect="false" type='text' placeholder='New password' onChange={(value) => setPassword(value.target.value)}/>
                        </div>

                        <div className="eu-bottom-fields">
                            <button type="submit" style={{width: "100%", opacity: (!firstName && !lastName && !password && !email) ? 0.5 : 1}} disabled={!firstName && !lastName && !password && !email} >Save</button>
                        </div>
                        <button className='eu-delete-btn' onClick={() => handleDelete()}>Delete user</button>
                    </form>
                </div>
            </div>
            
        </div>
    );
}

export default EditUsers;
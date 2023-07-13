import { FaUser } from 'react-icons/fa';


const UserCard = (props) => {
    return (
        <div className="user-card">
            <div className="photo">
                <FaUser className="profile-photo-icon" size={100} color="#0D99FF"/>
            </div>
            <div className="user-info">
                <p className="name">{props.firstName} {props.lastName}</p>
                <p className="email">{props.email}</p>
            </div>
            
        </div>
    )
}

export default UserCard;
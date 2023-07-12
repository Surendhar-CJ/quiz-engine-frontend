

const UserCard = (props) => {
    return (
        <div className="user-card">
            <p>PhotoIcon</p>
            <p>{props.firstName} {props.lastName}</p>
            <p>{props.email}</p>
        </div>
    )
}

export default UserCard;
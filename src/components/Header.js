import { BiSolidHome } from 'react-icons/bi';
import { FaUser } from 'react-icons/fa';
import { IoLogOut } from 'react-icons/io';
import { useLocation } from 'react-router-dom';
import '../styles/Header.css';

const title = "Quizflect"

const Header = ({ options }) => {
    const location = useLocation();
    
    return (
        <header className="header-container">
            <div className="header-content">
                <h1 className="title">{title}</h1>
                <div className="options">
                    {options.map(({ label, action, Icon }) => (
                        <h3 key={label} 
                            className={`${label.toLowerCase().replace(/\s+/g, '-')} 
                                        ${location.pathname.includes(label.toLowerCase()) ? 'active' : ''}`} 
                            onClick={action}>
                            {Icon ? <Icon size={label === 'Profile' ? 20 : 24} color={'black'}/> : label.toUpperCase()}
                        </h3>
                    ))}     
                </div>
            </div>
        </header>
    )
}

export default Header;

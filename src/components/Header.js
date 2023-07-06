
const title = "QUIZ ENGINE"


const Header = ({ options }) => {
    
    return (
        <header className="header-container">
            <h1 className="title">{title}</h1>
             <div className="options">
                {options.map(({ label, action, Icon }) => (
                    <h3 key={label} className={label.toLowerCase().replace(/\s+/g, '-')} onClick={action}>
                        {Icon ? <Icon /> : label.toUpperCase()}
                    </h3>
                ))}     
            </div>
        </header>
    )
}

export default Header;
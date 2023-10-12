import styles from './button.module.css';
import {Link} from 'react-router-dom';


interface IButton{
    path:string,
    text:string,
    stylesProps?:object
    className?:string
}
export const GuestButton = ({path,text,stylesProps,className}:IButton): JSX.Element => {

    return (
    <Link to ={path} className={`${styles.button} ${className}`} style={stylesProps}>
        {text}
    </Link>
)
}
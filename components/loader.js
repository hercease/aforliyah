'use client'
import styles from '../app/Loader.module.css'
import {MoonLoader,GridLoader} from 'react-spinners'
const Loader = () => {
    return (
        <div className={styles.wrapper}>
            <GridLoader
			   color="#ffffff"
			   size={15}
			   />

        </div>
     );
}

export default Loader;
import React from 'react';
import Loader from 'react-loader-spinner'
export default class Spinner extends React.Component {
    //other logic
    render() {
        const style = this.props.isFullScreen ? styles.fullScreen : styles.nested
        const size = this.props.size || 100

        return (
            <div style={style} className={this.props.classes} >

                <Loader
                    type="Puff"
                    color="#B89122"
                    height={size}
                    width={size}
                // timeout={3000} //3 secs

                />
            </div>
        );
    }
}

const styles = {
    fullScreen: {
        height: 100 + 'vh',
        width: 100 + '%',
        backgroundColor: '#fff',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    nested: {
        height: 100 + '100%',
        width: 100 + '%',
        zIndex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
}
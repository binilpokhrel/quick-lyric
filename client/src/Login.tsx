import React from 'react';
import { Button, ButtonContent, Icon } from 'semantic-ui-react';
import './Login.css';

function Login() {
    return (
        <div>
            <Button as='a' href='http://localhost:3000/api/spotify/connect' style={{backgroundColor: '#1DB954'}} animated>
                <ButtonContent visible>Login</ButtonContent>
                <ButtonContent hidden>
                    <Icon name='spotify' />
                </ButtonContent>
            </Button>
        </div>
    )
}


export default Login;
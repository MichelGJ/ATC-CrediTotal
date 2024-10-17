import jwt from 'jsonwebtoken';
import { envs } from './envs';


const JWT_SEED = envs.JWT_SEED;



export class JwtAdapter {

  // DI?

  static async generateToken( payload:any, duration: string = '12h' ) {

    return new Promise((resolv) => {
      jwt.sign(payload, JWT_SEED, { expiresIn: duration, algorithm: 'HS256' }, (err, token) => {
        
        if ( err ) return resolv(null);

        resolv(token)

      });
    })
  }


 static validateToken<T>(token: string): Promise< T | null> {
    
    return new Promise( (resolve) => {

      jwt.verify( token, JWT_SEED, (err, decoded) => {

        if( err ) return resolve(null);

        resolve( decoded as T);

      });



    })
  }


}


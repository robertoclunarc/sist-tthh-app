import md5 from 'md5';

export const validatePassword = async function (passwordIn: string, passwordsaved: string): Promise<boolean> {
    console.log('Normal password : ', passwordIn);
    console.log('Hashed password : ', md5(passwordIn));
    if (passwordsaved == md5(passwordIn) )
    {        
        return true;    
    }        
    else
    {
          return false;
    }

}
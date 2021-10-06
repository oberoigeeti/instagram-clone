import React, {useState, useEffect} from 'react';
import './App.css';
import Post from './Post';
import { db, auth } from './firebase';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import {Button, Input} from '@mui/material';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function App() {
  const [posts, setPosts] = useState([]);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser]  = useState(null);
  
  useEffect(()=>{
    const unsubscribe = auth.onAuthStateChanged((authUser)=>{
      if(authUser){
        //if user has logged in
        console.log(authUser);
        setUser(authUser);

      } else{
        //if user has logged out
        setUser(null);
      }
    })
    return () => {
      //perform some cleanup actions
      unsubscribe();
    }
  }, [user, username])

  //useEffect runs a piece of code based on specific condition
  
  useEffect(() =>{
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      //every time post is added, this code is fired using onSnapshot
      setPosts(snapshot.docs.map((doc) => ({
        id: doc.id,
        post: doc.data(),
      })))
    })
  }, []);
 
  const handleClose= ()=>{
      setOpen(false);
  }
  
  const signUp = (e) => {
    e.preventDefault();

    auth
    .createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username,
      })
    })
    .catch((error) => alert(error.message));

    setOpen(false);
  }

  const signIn = (e) => {
    e.preventDefault();

    auth
    .signInWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message));

    setOpenSignIn(false);

  }


  return (
    <div className="app">
      {/* <h1>Hello gonna build an insta clone. yayy!!</h1> */}
      <Modal
        open={open}
        onClose={(handleClose)}
      >
        <Box sx={style}>
         <Typography id="modal-modal-title" variant="h6" component="h2">
           <form className="app__signup">
            <center>
              <img 
                className= "app__headerImage"
                src = "https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
                alt =""
            />
            </center>

            <Input type = "text" placeholder="username" value={username} onChange= {e => setUsername(e.target.value)} />
            <Input type = "text" placeholder="email" value={email} onChange= {e => setEmail(e.target.value)} />
            <Input type = "password" placeholder="password" value={password} onChange= {e => setPassword(e.target.value)} />
            <Button variant = "contained" onClick={signUp}>Sign Up</Button>
            </form>
          </Typography>
        </Box>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={(handleClose)}
      >
        <Box sx={style}>
         <Typography id="modal-modal-title" variant="h6" component="h2">
           <form className="app__signup">
            <center>
              <img 
                className= "app__headerImage"
                src = "https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
                alt =""
            />
            </center>

            <Input type = "text" placeholder="email" value={email} onChange= {e => setEmail(e.target.value)} />
            <Input type = "password" placeholder="password" value={password} onChange= {e => setPassword(e.target.value)} />
            <Button variant = "contained" onClick={signIn}>Sign In</Button>
            </form>
          </Typography>
        </Box>
      </Modal>

      <div className = "app__header">
        <img 
          className= "app__headerImage"
          src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtPCwXCwFuJhFciPRaEHZy-bsnrnZrXImsLvaJvD9nsHYDzOhXaWu3CnQqyqOXLp4H2Uw&usqp=CAU"
          alt =""
          />
           {
        user ? (
          <div className="app__loginContainer">
          <button onClick= {()=> auth.signOut()}>Logout</button></div>
        ): (
        <div className = "app__loginContainer">
        <button  type = "submit" onClick={()=> setOpenSignIn(true)}>Sign In</button>
        <button  type="submit" onClick={()=> setOpen(true)}>Sign Up</button>
        </div>
        )}
        </div>

       
       <div className="app__posts">
        
         {
          posts.map(({id,post}) => (
            <Post key = {id} postId={id} user={user} username = {post.username} caption={post.caption} imgUrl = {post.imageUrl} />
          ))
        }  
        </div> 
      
      
       <div className="app__image">
       {user?.displayName ? (
       <ImageUpload username={user.displayName} />
         ):(
           <h2><strong>You need to login to upload</strong></h2>
         )}
         </div>

      </div>
    
  );
}

export default App;

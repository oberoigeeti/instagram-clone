import React, {useState, useEffect} from 'react';
import './Post.css';
import Avatar from "@mui/material/Avatar";
import { db } from './firebase';
import firebase from 'firebase';

function Post({postId, user, username, caption, imgUrl}) {

    const[comments, setComments] = useState([]);
    const[comment, setComment] = useState("");
    
    
    useEffect(() => {
        let unsubscribe;
        if (postId) {
          unsubscribe = db
            .collection("posts")
            .doc(postId)
            .collection("comments")
            .orderBy('timestamp', 'desc')
            .onSnapshot((snapshot) => {
              setComments(snapshot.docs.map((doc) => (doc.data())));
            });
        }
        return () => {
          unsubscribe();
        };
      }, [postId]);

    const postComment=(e)=>{
        e.preventDefault();

        db.collection("posts").doc(postId).collection("comments").add({
            username: user.displayName,
            text: comment,
            timestamp: firebase.firestore.FieldValue.serverTimestamp() ,
        });

        setComment("");
   };

    return (
        <div className="post">
            <div className="post__header">
            <Avatar 
                className="post__avatar"
                alt = "{username}"
                src = "https://i2.wp.com/abcsofliteracy.com/wp-content/uploads/2018/11/letterglogo.jpg"
            />

            <h3>{username}</h3>
            </div>
            {/* header -> avatar + username */}
            
            <img className = "post__image"
                src= {imgUrl}
            />
            {/* image */}

            <h4 className="post__text"><strong>{username}</strong> {caption}</h4>
            {/* username + caption */}

            <div className = "post__comments">
            {comments.map((comment) => (
                <p><strong>{comment.username}</strong> {comment.text}</p>
            ))
            }
            </div>
           
            {user && (
                 <form className="post__commentbox">
                 <input
                     className="post__input"
                     type="text"
                     placeholder="Add a comment"
                     value={comment}
                     onChange={(e)=> setComment(e.target.value)}
                 />
                 <button
                     className="post__button"
                     disabled={!comment}
                     type="submit"
                     onClick={postComment}
                 >
                     Post
                 </button>
             </form>
            )}
           
        </div>
    );
}

export default Post;
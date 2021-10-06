import React, {useState} from 'react';
import Input from '@mui/material/Input';
import Button from '@mui/material/Button';
import {storage, db} from './firebase';
import firebase from 'firebase';
import './ImageUpload.css';

function ImageUpload({username}) {

    const [caption, setCaption] = useState('');
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);

    const handleChange = (e) => {
        if(e.target.files[0]){
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                //progress function..
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );

                setProgress(progress);
            },

            (error) => {
                console.log(error);
                alert(error.message);
            },

            () => {
                //complete function

                storage
                .ref("images")
                .child(image.name)
                .getDownloadURL()
                .then(url => {
                    db.collection("posts").add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption: caption,
                        imageUrl: url,
                        username: username,
                    });
                    setProgress(0);
                    setCaption("");
                    setImage(null);
                });
            }
        )
    };

    return (
        <div className = 'image__upload'>
            <progress className="image__progress" value = {progress} max = "100" />
            <Input type = "text" placeholder="Enter a caption" value={caption} onChange= {e => setCaption(e.target.value)} />
            <Input type = "file" onChange= {handleChange} />
            <Button variant = "contained" onClick={handleUpload}>Upload</Button>
        </div>
    )
}

export default ImageUpload;

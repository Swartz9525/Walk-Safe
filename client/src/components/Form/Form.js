import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPost, updatePost } from "../../actions/posts";
import TextField from '@material-ui/core/TextField';
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import FileBase from 'react-file-base64';
import useStyles from "./styles.js";
import { useNavigate } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';

const Form = ({ currentId, setCurrentId }) => {
  const [postData, setPostData] = useState({
    comment: "",
    title: "",
    message: "",
    tags: "",
    selectedFile: "",
    rating: 0,
  });
  const post = useSelector((state) =>
    currentId ? state.posts.posts.find((p) => p._id === currentId) : null
  );
  const dispatch = useDispatch();
  const user = JSON.parse(localStorage.getItem("profile"));
  const navigate = useNavigate();

  useEffect(() => {
    if (post) {
      setPostData(post);
    }
  }, [post]);

  const clear = () => {
    setCurrentId(0);
    setPostData({
      comment: "",
      title: "",
      message: "",
      tags: "",
      selectedFile: "",
      rating: 0,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentId === 0) {
      dispatch(createPost({ ...postData, name: user?.result?.name }, navigate));
      clear();
    } else {
      dispatch(updatePost(currentId, { ...postData, name: user?.result?.name }));
      clear();
    }
  };

  const handleRatingChange = (value) => {
    setPostData({ ...postData, rating: value });
  };

  const classes = useStyles();

  if (!user?.result?.name) {
    return (
      <Paper className={classes.paper}>
        <Typography variant="h6" align="center">
          Please Sign In to Share your own Experience and like other's Experience!
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper className={classes.paper} elevation={6}>
      <form
        autoComplete="off"
        noValidate
        className={`${classes.root} ${classes.form}`}
        onSubmit={handleSubmit}
      >
        <Typography variant="h6">
          {currentId ? `Editing "${post?.title}"` : "Share Your Experience"}
        </Typography>
        <TextField
          name="title"
          variant="outlined"
          label="Title"
          fullWidth
          multiline
          value={postData.title}
          onChange={(e) => setPostData({ ...postData, title: e.target.value })}
        />
        <TextField
          name="message"
          variant="outlined"
          label="Message"
          fullWidth
          multiline
          value={postData.message}
          onChange={(e) =>
            setPostData({ ...postData, message: e.target.value })
          }
        />
        <TextField
          name="tags"
          variant="outlined"
          label="Tags"
          fullWidth
          value={postData.tags}
          onChange={(e) =>
            setPostData({ ...postData, tags: e.target.value.split(",") })
          }
        />
        <div className={classes.fileInput}>
          <FileBase
            type="file"
            multiple={false}
            onDone={({ base64 }) =>
              setPostData({ ...postData, selectedFile: base64 })
            }
          />
        </div>
        <Typography variant="h6">Safety Rate :</Typography>
        <div>
          {[1, 2, 3, 4, 5].map((value) => (
            <IconButton
              key={value}
              onClick={() => handleRatingChange(value)}
            >
              {postData.rating >= value ? (
                <StarIcon color="primary" />
              ) : (
                <StarBorderIcon color="primary" />
              )}
            </IconButton>
          ))}
        </div>
        <Button
          className={classes.buttonSubmit}
          variant="contained"
          color="primary"
          size="large"
          type="submit"
          fullWidth
        >
          Submit
        </Button>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={clear}
          fullWidth
        >
          Clear
        </Button>
      </form>
    </Paper>
  );
};

export default Form;

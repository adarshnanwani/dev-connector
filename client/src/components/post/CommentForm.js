import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addComment } from '../../actions/post';

const CommentForm = ({ postId, addComment }) => {
  const [formData, setFormData] = useState({
    text: '',
  });

  const { text } = formData;

  const onSubmit = (e) => {
    e.preventDefault();
    addComment(postId, formData);
    setFormData({ text: '' });
  };
  return (
    <div className='post-form'>
      <div className='post-form-header bg-primary'>
        <h3>Leave a comment</h3>
      </div>
      <form className='form my-1' onSubmit={onSubmit}>
        <textarea
          cols='30'
          rows='5'
          placeholder='Comment on this post'
          value={text}
          onChange={(e) => setFormData({ text: e.target.value })}
        ></textarea>
        <input type='submit' value='Submit' className='btn btn-dark my-1' />
      </form>
    </div>
  );
};

CommentForm.propTypes = {
  postId: PropTypes.string.isRequired,
  addComment: PropTypes.func.isRequired,
};

export default connect(null, { addComment })(CommentForm);

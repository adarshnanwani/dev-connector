import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addPost } from '../../actions/post';

const PostForm = ({ addPost }) => {
  const [formData, setFormData] = useState({
    text: '',
  });

  const { text } = formData;

  const onSubmit = (e) => {
    e.preventDefault();
    addPost(formData);
    setFormData({ text: '' });
  };
  return (
    <div className='post-form'>
      <div className='post-form-header bg-primary'>
        <h3>Say something...</h3>
      </div>
      <form className='form my-1' onSubmit={onSubmit}>
        <textarea
          cols='30'
          rows='5'
          placeholder='Create a post'
          value={text}
          onChange={(e) => setFormData({ text: e.target.value })}
        ></textarea>
        <input type='submit' value='Submit' className='btn btn-dark my-1' />
      </form>
    </div>
  );
};

PostForm.propTypes = {
  addPost: PropTypes.func.isRequired,
};

export default connect(null, { addPost })(PostForm);

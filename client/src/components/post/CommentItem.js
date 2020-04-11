import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Moment from 'react-moment';
import { deleteComment } from '../../actions/post';

const CommentItem = ({ comment, postId, deleteComment, auth }) => {
  const deleteHandler = () => {
    deleteComment(postId, comment._id);
  };
  return (
    <div className='post bg-white p-1 my-1'>
      <div>
        <Link to={`/profile/${comment.user}`}>
          <img className='round-img' src={comment.avatar} alt={comment.name} />
          <h4>{comment.name}</h4>
        </Link>
      </div>
      <div>
        <p className='my-1'>{comment.text}</p>
        <p className='post-date'>
          Posted on <Moment format='YYYY/MM/DD'>{comment.date}</Moment>
        </p>
        {comment.user === auth.user._id && (
          <button
            type='button'
            className='btn btn-danger'
            onClick={deleteHandler}
          >
            <i className='fas fa-times'></i>
          </button>
        )}
      </div>
    </div>
  );
};

CommentItem.propTypes = {
  comment: PropTypes.object.isRequired,
  postId: PropTypes.string.isRequired,
  deleteComment: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { deleteComment })(CommentItem);

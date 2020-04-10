import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

const Education = ({
  education: { school, from, to, degree, fieldofstudy, description },
}) => {
  return (
    <div className='my-1'>
      <h3 className='text-dark'>{school}</h3>
      <p>
        <Moment format='YYYY/MM/DD'>{from}</Moment> -{' '}
        {!to ? 'Now' : <Moment format='YYYY/MM/DD'>{to}</Moment>}
      </p>
      <p>
        <strong>Degree:</strong> {degree}
      </p>
      <p>
        <strong>Field Of Study:</strong> {fieldofstudy}
      </p>
      <p>
        <strong>Description:</strong> {description}
      </p>
    </div>
  );
};

Education.propTypes = {
  education: PropTypes.object.isRequired,
};

export default Education;

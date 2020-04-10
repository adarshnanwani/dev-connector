import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import Top from './Top';
import Experience from './Experience';
import Education from './Education';
import About from './About';
import Github from './Github';
import { getProfileById } from '../../actions/profile';

const Profile = ({
  getProfileById,
  auth,
  profile: { profile, loading },
  match,
}) => {
  useEffect(() => {
    getProfileById(match.params.id);
  }, [getProfileById, match.params.id]);
  return (
    <Fragment>
      {profile === null || loading ? (
        <Spinner></Spinner>
      ) : (
        <Fragment>
          <Link to='/profiles' className='btn btn-primary'>
            Back To Profiles
          </Link>
          {auth.isAuthenticated &&
            auth.loading === false &&
            auth.user._id === profile.user._id && (
              <Link to='/edit-profile' className='btn btn-dark'>
                Edit Profile
              </Link>
            )}
          <div className='profile-grid my-1'>
            <Top profile={profile} />
            <About profile={profile} />
            <div className='profile-exp bg-white p-2'>
              <h2 className='text-primary'>Experiences</h2>
              {profile.experience.length > 0 ? (
                <Fragment>
                  {profile.experience.map((exp) => (
                    <Experience key={exp._id} experience={exp} />
                  ))}
                </Fragment>
              ) : (
                <h4>No experience credentials</h4>
              )}
            </div>
            <div className='profile-edu bg-white p-2'>
              <h2 className='text-primary'>Education</h2>
              {profile.education.length > 0 ? (
                <Fragment>
                  {profile.education.map((edu) => (
                    <Education key={edu._id} education={edu} />
                  ))}
                </Fragment>
              ) : (
                <h4>No education credentials</h4>
              )}
            </div>
            {profile.githubusername && (
              <Github username={profile.githubusername} />
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

Profile.propTypes = {
  profile: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  getProfileById: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  auth: state.auth,
});

export default connect(mapStateToProps, { getProfileById })(Profile);

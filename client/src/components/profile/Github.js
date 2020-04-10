import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { getGithubRepos } from '../../actions/profile';

const Github = ({ username, getGithubRepos, repos }) => {
  useEffect(() => {
    getGithubRepos(username);
  }, [getGithubRepos, username]);

  return (
    <div className='profile-github'>
      <h2 className='text-primary my-1'>
        <i className='fab fa-github'></i> Github Repos
      </h2>

      {repos === null ? (
        <Spinner></Spinner>
      ) : (
        repos.map((repo) => (
          <div className='repo bg-white my-1 p-1' key={repo.id}>
            <div>
              <h4>
                <a
                  href={repo.html_url}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  {repo.name}
                </a>
              </h4>
              <p>{repo.description}</p>
            </div>

            <div>
              <ul>
                <li className='badge badge-primary'>
                  Stars: {repos.stargazers_count ? repos.stargazers_count : '0'}
                </li>
                <li className='badge badge-dark'>
                  Watchers: {repos.watchers_count ? repos.watchers_count : '0'}
                </li>
                <li className='badge badge-light'>
                  Forks: {repos.forks_count ? repos.forks_count : '0'}
                </li>
              </ul>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

Github.propTypes = {
  username: PropTypes.string.isRequired,
  getGithubRepos: PropTypes.func.isRequired,
  repos: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  repos: state.profile.repos,
});

export default connect(mapStateToProps, { getGithubRepos })(Github);

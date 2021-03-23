import React from 'react';
import cx from 'classnames';

class SearchBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeSearch: false,
    };
  }

  render() {
    const { activeSearch } = this.state;
    return (
      <>
        <div className={cx('search-wrapper', {
          active: activeSearch,
        })}
        >
          <div className="input-holder">
            <input type="text" className="search-input" placeholder="Type to search" />
            <button
              type="button"
              onClick={() => this.setState({ activeSearch: !activeSearch })}
              className="search-icon"
            >
              <span />
            </button>
          </div>
          <button
            type="button"
            onClick={() => this.setState({ activeSearch: !activeSearch })}
            className="close"
          >
            <span />
          </button>
        </div>
      </>
    );
  }
}

export default SearchBox;

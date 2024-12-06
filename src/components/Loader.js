// import React from "react";



// const Loader = () => {
//   return (
//     /* From Uiverse.io by andrew-demchenk0 */
//     <div className="pyramid-loader">
//       <div className="wrapper">
//         <span className="side side1" />
//         <span className="side side2" />
//         <span className="side side3" />
//         <span className="side side4" />
//         <span className="shadow" />
//       </div>
//     </div>

//   );
// };

// export default Loader;

import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="loading-spinner">
        <div className="loading-spinner-inner">
          <div className="loading-spinner-circle" />
          <div className="loading-spinner-circle" />
          <div className="loading-spinner-circle" />
          <div className="loading-spinner-circle" />
          <div className="loading-spinner-circle" />
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .loading-spinner {
    display: flex;
    align-items: center;
    justify-content: center;
    // height: 8em;
    transform: translate(0%, -150%);
  }

  .loading-spinner-inner {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .loading-spinner-circle {
    width: 1em;
    height: 1em;
    border-radius: 50%;
    background-color: #db9334;
    margin: 0 5px;
    animation: loading-spinner 1s ease-in-out infinite;
  }

  .loading-spinner-circle:nth-child(2) {
    animation-delay: 0.2s;
  }

  .loading-spinner-circle:nth-child(3) {
    animation-delay: 0.4s;
  }

  .loading-spinner-circle:nth-child(4) {
    animation-delay: 0.6s;
  }

  .loading-spinner-circle:nth-child(5) {
    animation-delay: 0.8s;
  }

  @keyframes loading-spinner {
    0% {
      transform: scale(1);
      opacity: 1;
    }

    20% {
      transform: scale(1.5);
      opacity: 0.5;
    }

    100% {
      transform: scale(1);
      opacity: 1;
    }
  }`;

export default Loader;



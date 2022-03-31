import { Link } from 'react-router-dom';
import main from '../assets/images/main.svg';
import Wrapper from '../assets/wrappers/LandingPage';
import { Logo } from '../components';

const Landing = () => {
  return (
    <Wrapper>
      <nav>
        <Logo />
      </nav>
      <div className="container page">
        {/* info */}
        <div className="info">
          <h1>
            job <span>tracking</span> app
          </h1>
          <p>
            I'm baby palo santo kitsch art party copper mug. Craft beer schlitz
            actually everyday carry, vexillologist before they sold out bespoke.
            Farm-to-table cornhole pitchfork cred, schlitz +1 keytar copper mug
            portland. Williamsburg umami XOXO aesthetic. Mustache master cleanse
            enamel pin photo booth, authentic cray pitchfork aesthetic plaid.
          </p>
          <Link to="/register" className="btn btn-hero">
            Login/Register
          </Link>
        </div>
        <img src={main} alt="job hunt" className="img main-img" />
      </div>
    </Wrapper>
  );
};

export default Landing;

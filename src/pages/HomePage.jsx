import Hero from '../components/HomeDashboard/Hero';
import Comm_Stats from '../components/HomeDashboard/Comm_Stats';
import FeatureCards from '../components/HomeDashboard/FeatureCards';
import useWasteData from '../hooks/useWasteData'; 
import './HomePage.css';

function HomePage() {
  // Use the hook to fetch totalCarbonEmission
  const { totalCarbonEmission } = useWasteData();

  return (
    <div className="waste-app">
      <div className="content-container">
        <Hero />
        <Comm_Stats totalCarbonEmission={totalCarbonEmission} />
        <FeatureCards />
      </div>
    </div>
  );
}

export default HomePage;
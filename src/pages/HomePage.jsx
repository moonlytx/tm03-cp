import Hero from '../components/HomeDashboard/Hero';
import Comm_Stats from '../components/HomeDashboard/Comm_Stats';
import FeatureCards from '../components/HomeDashboard/FeatureCards';
import useWasteData from '../hooks/useWasteData'; 
import './HomePage.css';
import { useEffect, useState } from 'react';

function HomePage() {
  const { communityCarbonEmission, fetchCommunityCarbonEmission } = useWasteData();
  const [communityCarbon, setCommunityCarbon] = useState(communityCarbonEmission);

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchCommunityCarbonEmission();
      setCommunityCarbon(result);
    };
    fetchData();
  }, [fetchCommunityCarbonEmission]);
  
  // Set up HomePage
  return (
    <div className="waste-app">
      <div className="content-container">
        <Hero />
        <Comm_Stats communityCarbon={communityCarbon} />
        <FeatureCards />
      </div>
    </div>
  );
}

export default HomePage;
import './Footer.css';

// Citations at the bottom for all pages
function Footer() {
  // Citation details 
  const topRowCategories = ['CARBON SAVINGS DATA', 'WEIGHT DATA', 'TRASH DATASET'];
  const bottomRowCategories = ['TRASH DETECTION API', 'LOCATION DATA & ROUTE FINDER API'];
  
  // All footer links data
  const footerLinksData = [
    {
      title: 'Hillman et al. (2015) Recycling Report',
      category: 'CARBON SAVINGS DATA',
      url: 'https://norden.diva-portal.org/smash/get/diva2:839864/fulltext03.pdf'
    },
    {
      title: 'UNESCAP Average Weights Report',
      category: 'WEIGHT DATA',
      url: 'https://www.unescap.org/sites/default/d8files/event-documents/KL%20Baseline%20Report-English.pdf'
    },
    {
      title: 'YOLOv8 - EE4016',
      category: 'TRASH DATASET',
      url: 'https://universe.roboflow.com/yolov8-trash-detection/ee4016'
    },
    {
      title: 'OpenAI GPT-4o API',
      category: 'TRASH DETECTION API',
      url: 'https://platform.openai.com/docs/overview'
    },
    {
      title: 'Google Maps API',
      category: 'LOCATION DATA & ROUTE FINDER API',
      url: 'https://developers.google.com/maps'
    }
  ];

  const groupedLinks = footerLinksData.reduce((acc, link) => {
    const category = link.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(link);
    return acc;
  }, {});

  const renderCategorySection = (categoryList) => {
    return (
      <div className="footer-row">
        {categoryList.map((category) => (
          <div key={category} className="footer-column">
            <h3 className="footer-category">{category}</h3>
            {groupedLinks[category]?.map((link, linkIndex) => (
              <a 
                key={linkIndex} 
                href={link.url} 
                className="footer-link-title"
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.title}
              </a>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-header">
          Carbon Patrol is Powered by:
        </div>
        <div className="footer-links-container">
          {renderCategorySection(topRowCategories)}
          {renderCategorySection(bottomRowCategories)}
        </div>
        {/* Little disclaimer at the bottom */}
        <div className="footer-bottom">
          <p>© 2025 Carbon Patrol. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
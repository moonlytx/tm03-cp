import './Footer.css';

function Footer() {
  const footerLinks = [
    {
      title: 'Hillman et al. (2015) Recycling Report',
      category: 'Carbon Savings Data',
      url: 'https://norden.diva-portal.org/smash/get/diva2:839864/fulltext03.pdf'
    },
    {
      title: 'UNESCAP Average Weights Report',
      category: 'Weight Data',
      url: 'https://www.unescap.org/sites/default/d8files/event-documents/KL%20Baseline%20Report-English.pdf'
    },
    {
      title: 'YOLOv8 - EE4016',
      category: 'Trash Dataset',
      url: 'https://universe.roboflow.com/yolov8-trash-detection/ee4016'
    },
    {
      title: 'OpenAI GPT-4o API',
      category: 'Trash Detection API',
      url: 'https://platform.openai.com/docs/overview'
    }
  ];

  // Group links by category
  const groupedLinks = footerLinks.reduce((acc, link) => {
    const category = link.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(link);
    return acc;
  }, {});

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-links">
          {Object.entries(groupedLinks).map(([category, links], index) => (
            <div key={index} className="footer-column">
              <h3 className="footer-category">{category}</h3>
              {links.map((link, linkIndex) => (
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
        <div className="footer-bottom">
          <p>© 2025 Carbon Patrol. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
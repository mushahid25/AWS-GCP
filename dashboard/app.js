// Data structure for AWS and GCP documentation
const AWS_DOCS = [
  { title: 'API Gateway', path: 'cloud/AWS/API_Gateway.md', icon: 'fa-solid fa-network-wired' },
  { title: 'AWS CLI Commands', path: 'cloud/AWS/aws-cli-commands-reference.md', icon: 'fa-solid fa-terminal' },
  { title: 'CloudFormation', path: 'cloud/AWS/CloudFormation.md', icon: 'fa-solid fa-layer-group' },
  { title: 'CloudFront', path: 'cloud/AWS/CloudFront.md', icon: 'fa-solid fa-globe' },
  { title: 'CloudWatch', path: 'cloud/AWS/CloudWatch.md', icon: 'fa-solid fa-chart-line' },
  { title: 'DynamoDB', path: 'cloud/AWS/DynamoDB.md', icon: 'fa-solid fa-database' },
  { title: 'EBS', path: 'cloud/AWS/EBS.md', icon: 'fa-solid fa-hard-drive' },
  { title: 'EC2', path: 'cloud/AWS/EC2.md', icon: 'fa-solid fa-server' },
  { title: 'ECS', path: 'cloud/AWS/ECS.md', icon: 'fa-solid fa-ship' },
  { title: 'IAM', path: 'cloud/AWS/IAM.md', icon: 'fa-solid fa-user-shield' },
  { title: 'Lambda', path: 'cloud/AWS/Lambda.md', icon: 'fa-solid fa-code' },
  { title: 'Networking', path: 'cloud/AWS/Networking.md', icon: 'fa-solid fa-network-wired' },
  { title: 'RDS', path: 'cloud/AWS/RDS.md', icon: 'fa-solid fa-database' },
  { title: 'Route53', path: 'cloud/AWS/Route53.md', icon: 'fa-solid fa-route' },
  { title: 'S3', path: 'cloud/AWS/S3.md', icon: 'fa-solid fa-cube' },
  { title: 'SNS & SQS', path: 'cloud/AWS/SNS_SQS.md', icon: 'fa-solid fa-bell' },
  { title: 'Storage', path: 'cloud/AWS/storage.md', icon: 'fa-solid fa-hdd' },
  { title: 'VPC', path: 'cloud/AWS/VPC.md', icon: 'fa-solid fa-network-wired' },
  { title: 'GCloud Commands', path: 'cloud/AWS/gcloud-commands-reference.md', icon: 'fa-solid fa-terminal' },
  { title: 'GCP-AWS Migration', path: 'cloud/AWS/gcp-aws-migration.md', icon: 'fa-solid fa-exchange-alt' },
];

const GCP_DOCS = [
  { title: 'Cloud Functions', path: 'cloud/GCP/CloudFunctions.md', icon: 'fa-solid fa-bolt' },
  { title: 'Cloud Storage', path: 'cloud/GCP/CloudStorage.md', icon: 'fa-solid fa-database' },
  { title: 'Compute Engine', path: 'cloud/GCP/ComputeEngine.md', icon: 'fa-solid fa-server' },
  { title: 'GKE', path: 'cloud/GCP/GKE.md', icon: 'fa-solid fa-dharmachakra' },
  { title: 'IAM', path: 'cloud/GCP/IAM.md', icon: 'fa-solid fa-user-shield' },
  { title: 'VPC', path: 'cloud/GCP/VPC.md', icon: 'fa-solid fa-network-wired' },
];

const AWS_PDF_DOCS = [
  { title: 'AMI Restoration Troubleshooting Guide', path: 'cloud/AWS/123/AMI_Restoration_Troubleshooting_Guide.pdf', icon: 'fa-solid fa-file-pdf' },
  { title: 'AWS Implementation Q&A', path: 'cloud/AWS/123/AWS_Implementation_QA.pdf', icon: 'fa-solid fa-file-pdf' },
  { title: 'AWS Implementation Q&A with Diagrams', path: 'cloud/AWS/123/AWS_Implementation_QA_with_Diagrams.pdf', icon: 'fa-solid fa-file-pdf' },
  { title: 'Cloud DevOps Networking Q&A', path: 'cloud/AWS/123/Cloud_DevOps_Networking_QA.pdf', icon: 'fa-solid fa-file-pdf' },
  { title: 'Cloud Q&A with All Diagrams', path: 'cloud/AWS/123/Cloud_QA_with_All_Diagrams.pdf', icon: 'fa-solid fa-file-pdf' },
  { title: 'Cloud Q&A with Diagrams', path: 'cloud/AWS/123/Cloud_QA_with_Diagrams.pdf', icon: 'fa-solid fa-file-pdf' },
  { title: 'Cloud Q&A with Visual Diagram', path: 'cloud/AWS/123/Cloud_QA_with_Visual_Diagram.pdf', icon: 'fa-solid fa-file-pdf' },
  { title: 'Detailed Cloud DevOps Networking Q&A', path: 'cloud/AWS/123/Detailed_Cloud_DevOps_Networking_QA.pdf', icon: 'fa-solid fa-file-pdf' },
];

// Create a markdown renderer
const md = window.markdownit();

// Main App Component
const App = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
  const [activeDocument, setActiveDocument] = React.useState(null);
  const [documentContent, setDocumentContent] = React.useState('');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [showBackToTop, setShowBackToTop] = React.useState(false);
  const [isPdf, setIsPdf] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  // Toggle sidebar collapse
  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode');
  };

  // Fetch document content
  const fetchDocument = async (docPath) => {
    setIsLoading(true);
    try {
      if (docPath.endsWith('.pdf')) {
        setIsPdf(true);
        // PDF file - we don't need to fetch text content
        setDocumentContent(``);
      } else {
        setIsPdf(false);
        // Fetch the actual markdown content
        const response = await fetch(`https://raw.githubusercontent.com/mushahid25/AWS-GCP/main/${docPath}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const content = await response.text();
        setDocumentContent(content);
      }
      
      setActiveDocument(docPath);
    } catch (error) {
      console.error('Error fetching document:', error);
      setDocumentContent(`# Error Loading Document

Sorry, we couldn't load the content for ${docPath}. Please try again later.`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle document selection
  const handleDocumentClick = (docPath) => {
    fetchDocument(docPath);
  };

  // Filter documents based on search query
  const filterDocuments = (docs) => {
    if (!searchQuery) return docs;
    return docs.filter(doc =>
      doc.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Scroll event handler for back-to-top button
  React.useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render document content
  const renderDocumentContent = () => {
    if (isLoading) {
      return <div className="loading">Loading...</div>;
    }

    if (!activeDocument) {
      return (
        <div className="welcome-content">
          <h1>Welcome to DevOps Study Dashboard</h1>
          <p>Select a document from the sidebar to get started.</p>
          
          <div className="content-section">
            <div className="content-section-header">
              <h2 className="content-section-title">AWS Documentation</h2>
            </div>
            <div className="card-grid">
              {AWS_DOCS.slice(0, 6).map((doc, index) => (
                <div key={index} className="card" onClick={() => handleDocumentClick(doc.path)}>
                  <div className="card-header">
                    <div className="card-icon">
                      <i className={doc.icon}></i>
                    </div>
                    <h3 className="card-title">{doc.title}</h3>
                  </div>
                  <div className="card-content">
                    Click to view documentation about {doc.title}.
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="content-section">
            <div className="content-section-header">
              <h2 className="content-section-title">GCP Documentation</h2>
            </div>
            <div className="card-grid">
              {GCP_DOCS.slice(0, 6).map((doc, index) => (
                <div key={index} className="card" onClick={() => handleDocumentClick(doc.path)}>
                  <div className="card-header">
                    <div className="card-icon">
                      <i className={doc.icon}></i>
                    </div>
                    <h3 className="card-title">{doc.title}</h3>
                  </div>
                  <div className="card-content">
                    Click to view documentation about {doc.title}.
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (isPdf) {
      return (
        <div>
          <div className="breadcrumb">
            <div className="breadcrumb-item">
              <a href="#" className="breadcrumb-link" onClick={() => setActiveDocument(null)}>Home</a>
            </div>
            <div className="breadcrumb-item">
              <a href="#" className="breadcrumb-link">{activeDocument.split('/')[0]}</a>
            </div>
            <div className="breadcrumb-item">
              <span className="breadcrumb-link">{activeDocument.split('/').pop()}</span>
            </div>
          </div>
          <h1>{activeDocument.split('/').pop()}</h1>
          <iframe
            className="pdf-viewer"
            src={`https://docs.google.com/viewer?url=https://raw.githubusercontent.com/mushahid25/AWS-GCP/main/${activeDocument}&embedded=true`}
            frameBorder="0"
          ></iframe>
          <p><em>Note: If the PDF doesn't load, please <a href={`https://raw.githubusercontent.com/mushahid25/AWS-GCP/main/${activeDocument}`} target="_blank" rel="noopener noreferrer">click here</a> to view it directly.</em></p>
        </div>
      );
    }

    return (
      <div>
        <div className="breadcrumb">
          <div className="breadcrumb-item">
            <a href="#" className="breadcrumb-link" onClick={(e) => { e.preventDefault(); setActiveDocument(null); }}>Home</a>
          </div>
          <div className="breadcrumb-item">
            <a href="#" className="breadcrumb-link">{activeDocument.split('/')[0]}</a>
          </div>
          <div className="breadcrumb-item">
            <span className="breadcrumb-link">{activeDocument.split('/').pop()}</span>
          </div>
        </div>
        <div 
          className="markdown-content"
          dangerouslySetInnerHTML={{ __html: md.render(documentContent) }}
        />
      </div>
    );
  };

  return (
    <div className="container">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <i className="fa-solid fa-cloud"></i>
            {!sidebarCollapsed && <span>DevOps Study</span>}
          </div>
          <button className="toggle-btn" onClick={toggleSidebar}>
            <i className={`fa-solid ${sidebarCollapsed ? 'fa-chevron-right' : 'fa-chevron-left'}`}></i>
          </button>
        </div>
        
        {!sidebarCollapsed && (
          <>
            <div className="search-bar">
              <i className="fa-solid fa-search"></i>
              <input 
                type="text" 
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="nav-section">
              <h3>AWS Documentation</h3>
              <ul className="nav-items">
                {filterDocuments(AWS_DOCS).map((doc, index) => (
                  <li 
                    key={index} 
                    className={`nav-item ${activeDocument === doc.path ? 'active' : ''}`}
                    onClick={() => handleDocumentClick(doc.path)}
                  >
                    <a href="#" className="nav-link">
                      <i className={doc.icon}></i>
                      <span>{doc.title}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="nav-section">
              <h3>GCP Documentation</h3>
              <ul className="nav-items">
                {filterDocuments(GCP_DOCS).map((doc, index) => (
                  <li 
                    key={index} 
                    className={`nav-item ${activeDocument === doc.path ? 'active' : ''}`}
                    onClick={() => handleDocumentClick(doc.path)}
                  >
                    <a href="#" className="nav-link">
                      <i className={doc.icon}></i>
                      <span>{doc.title}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="nav-section">
              <h3>PDF Resources</h3>
              <ul className="nav-items">
                {filterDocuments(AWS_PDF_DOCS).map((doc, index) => (
                  <li 
                    key={index} 
                    className={`nav-item ${activeDocument === doc.path ? 'active' : ''}`}
                    onClick={() => handleDocumentClick(doc.path)}
                  >
                    <a href="#" className="nav-link">
                      <i className={doc.icon}></i>
                      <span>{doc.title}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
      
      {/* Main Content */}
      <div className="content">
        <div className="content-header">
          <h1 className="content-title">
            {activeDocument ? activeDocument.split('/').pop().replace('.md', '') : 'DevOps Study Dashboard'}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {!sidebarCollapsed && (
              <div className="search-bar">
                <i className="fa-solid fa-search"></i>
                <input 
                  type="text" 
                  placeholder="Search documentation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            )}
            <button className="dark-mode-toggle" onClick={toggleDarkMode}>
              <i className={`fa-solid ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
            </button>
          </div>
        </div>
        
        {renderDocumentContent()}
      </div>
      
      {/* Back to Top Button */}
      <div 
        className={`back-to-top ${showBackToTop ? 'visible' : ''}`}
        onClick={scrollToTop}
      >
        <i className="fa-solid fa-chevron-up"></i>
      </div>
    </div>
  );
};

// Render the App
ReactDOM.render(<App />, document.getElementById('app'));
// Cybersecurity Fundamentals Path
export const cybersecurityPathData = {
  title: 'Cybersecurity Fundamentals',
  description: 'Learn essential cybersecurity concepts, ethical hacking, and security best practices. Protect systems and data from modern cyber threats.',
  icon: '🔒',
  difficulty: 'beginner' as const,
  estimatedDuration: 60,
  prerequisites: ['Basic computer knowledge', 'Networking basics', 'Understanding of operating systems'],
  tags: ['cybersecurity', 'ethical-hacking', 'security', 'networking', 'privacy', 'penetration-testing'],
  isPublic: true,
  enrollmentCount: 1834,
  completionRate: 82,
  averageRating: 4.3,
  totalRatings: 1156
};

export const cybersecurityCourses = [
  {
    courseTitle: 'Security Fundamentals & Threat Landscape',
    slug: 'security-fundamentals-threats',
    modules: [
      {
        title: 'Introduction to Cybersecurity',
        topics: [
          {
            title: 'Cybersecurity Basics',
            subtopics: [
              {
                id: 'cybersec-intro',
                title: 'What is Cybersecurity?',
                videoUrl: 'https://www.youtube.com/embed/inWWhr5tnEA',
                content: `<h2>Cybersecurity Overview</h2>
                <p>Cybersecurity is the practice of protecting systems, networks, and programs from digital attacks. These attacks usually aim to access, change, or destroy sensitive information.</p>
                
                <h3>Core Security Principles (CIA Triad):</h3>
                <ul>
                  <li><strong>Confidentiality:</strong> Ensuring information is accessible only to authorized users</li>
                  <li><strong>Integrity:</strong> Maintaining accuracy and completeness of data</li>
                  <li><strong>Availability:</strong> Ensuring authorized users have access when needed</li>
                </ul>
                
                <h3>Common Threat Types:</h3>
                <ul>
                  <li><strong>Malware:</strong> Viruses, worms, trojans, ransomware</li>
                  <li><strong>Phishing:</strong> Fraudulent attempts to obtain sensitive information</li>
                  <li><strong>Social Engineering:</strong> Manipulating people to divulge information</li>
                  <li><strong>DDoS Attacks:</strong> Overwhelming systems with traffic</li>
                  <li><strong>Man-in-the-Middle:</strong> Intercepting communications</li>
                </ul>`,
                duration: 25
              },
              {
                id: 'threat-landscape',
                title: 'Modern Threat Landscape',
                content: `<h2>Current Cybersecurity Threats</h2>
                <p>The cybersecurity landscape is constantly evolving with new threats emerging regularly. Understanding current threats is crucial for effective defense.</p>
                
                <h3>Advanced Persistent Threats (APTs):</h3>
                <ul>
                  <li>Long-term targeted attacks</li>
                  <li>State-sponsored groups</li>
                  <li>Sophisticated techniques</li>
                  <li>Multiple attack vectors</li>
                </ul>
                
                <h3>Ransomware Evolution:</h3>
                <ul>
                  <li>Ransomware-as-a-Service (RaaS)</li>
                  <li>Double extortion tactics</li>
                  <li>Supply chain attacks</li>
                  <li>Critical infrastructure targeting</li>
                </ul>`,
                duration: 20
              }
            ]
          }
        ]
      }
    ]
  },
  {
    courseTitle: 'Network Security & Cryptography',
    slug: 'network-security-cryptography',
    modules: [
      {
        title: 'Network Security Fundamentals',
        topics: [
          {
            title: 'Securing Network Communications',
            subtopics: [
              {
                id: 'network-security',
                title: 'Network Security Basics',
                videoUrl: 'https://www.youtube.com/embed/kBzbKUirOFk',
                content: `<h2>Network Security</h2>
                <p>Network security involves protecting the integrity, confidentiality, and availability of computer networks and data using both software and hardware technologies.</p>
                
                <h3>Network Security Components:</h3>
                <ul>
                  <li><strong>Firewalls:</strong> Control network traffic based on rules</li>
                  <li><strong>IDS/IPS:</strong> Detect and prevent intrusions</li>
                  <li><strong>VPNs:</strong> Secure remote connections</li>
                  <li><strong>Network Segmentation:</strong> Isolate network segments</li>
                  <li><strong>Access Control:</strong> Manage user permissions</li>
                </ul>`,
                duration: 30
              },
              {
                id: 'cryptography-basics',
                title: 'Cryptography Fundamentals',
                videoUrl: 'https://www.youtube.com/embed/jhXCTbFnK8o',
                content: `<h2>Cryptography</h2>
                <p>Cryptography is the practice of securing information by transforming it into an unreadable format for unauthorized users.</p>
                
                <h3>Types of Cryptography:</h3>
                <ul>
                  <li><strong>Symmetric Encryption:</strong> Same key for encryption and decryption (AES, DES)</li>
                  <li><strong>Asymmetric Encryption:</strong> Public/private key pairs (RSA, ECC)</li>
                  <li><strong>Hash Functions:</strong> One-way functions (SHA-256, MD5)</li>
                  <li><strong>Digital Signatures:</strong> Verify authenticity and integrity</li>
                </ul>`,
                duration: 25
              }
            ]
          }
        ]
      }
    ]
  },
  {
    courseTitle: 'Ethical Hacking & Penetration Testing',
    slug: 'ethical-hacking-pentesting',
    modules: [
      {
        title: 'Introduction to Ethical Hacking',
        topics: [
          {
            title: 'Penetration Testing Methodology',
            subtopics: [
              {
                id: 'ethical-hacking-intro',
                title: 'What is Ethical Hacking?',
                videoUrl: 'https://www.youtube.com/embed/3Kq1MIfTWCE',
                content: `<h2>Ethical Hacking</h2>
                <p>Ethical hacking involves authorized attempts to gain unauthorized access to systems to identify security vulnerabilities before malicious hackers do.</p>
                
                <h3>Types of Hackers:</h3>
                <ul>
                  <li><strong>White Hat:</strong> Ethical hackers who help improve security</li>
                  <li><strong>Black Hat:</strong> Malicious hackers with criminal intent</li>
                  <li><strong>Gray Hat:</strong> Between white and black hat hackers</li>
                </ul>
                
                <h3>Penetration Testing Phases:</h3>
                <ol>
                  <li><strong>Planning & Reconnaissance:</strong> Gather information about target</li>
                  <li><strong>Scanning:</strong> Identify live systems and services</li>
                  <li><strong>Gaining Access:</strong> Exploit vulnerabilities</li>
                  <li><strong>Maintaining Access:</strong> Establish persistent access</li>
                  <li><strong>Analysis & Reporting:</strong> Document findings and recommendations</li>
                </ol>`,
                duration: 30
              },
              {
                id: 'vulnerability-assessment',
                title: 'Vulnerability Assessment',
                content: `<h2>Vulnerability Assessment</h2>
                <p>Vulnerability assessment is the process of identifying, quantifying, and prioritizing security vulnerabilities in systems.</p>
                
                <h3>Assessment Types:</h3>
                <ul>
                  <li><strong>Network Assessment:</strong> Scan network infrastructure</li>
                  <li><strong>Host Assessment:</strong> Evaluate individual systems</li>
                  <li><strong>Application Assessment:</strong> Test web and mobile apps</li>
                  <li><strong>Wireless Assessment:</strong> Evaluate wireless networks</li>
                </ul>
                
                <h3>Vulnerability Scoring:</h3>
                <ul>
                  <li><strong>CVSS:</strong> Common Vulnerability Scoring System</li>
                  <li><strong>Risk Rating:</strong> Critical, High, Medium, Low</li>
                  <li><strong>Impact Assessment:</strong> Business impact analysis</li>
                </ul>`,
                duration: 25
              }
            ]
          }
        ]
      }
    ]
  }
];

export const cybersecurityMilestones = [
  {
    title: 'Security Basics',
    description: 'Understand fundamental security concepts and threats',
    order: 1
  },
  {
    title: 'Network Security',
    description: 'Master network security and cryptography',
    order: 2
  },
  {
    title: 'Ethical Hacker',
    description: 'Learn penetration testing and vulnerability assessment',
    order: 3
  },
  {
    title: 'Security Professional',
    description: 'Implement comprehensive security programs',
    order: 4
  }
];
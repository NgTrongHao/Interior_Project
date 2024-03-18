import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, listAll, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import Cookies from 'js-cookie'; // Import thư viện Cookies để truy cập vào cookie
import './ProposalPdf.css';
import { useParams } from 'react-router-dom'; // Import useParams để trích xuất id từ URL param
import { useNavigate } from 'react-router-dom';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';



const firebaseConfig = {
  apiKey: "AIzaSyAERDdSWHvq2YAPdBmoToq8i6iNQXHd5lc",
  authDomain: "uploadingfile-b4b39.firebaseapp.com",
  projectId: "uploadingfile-b4b39",
  storageBucket: "uploadingfile-b4b39.appspot.com",
  messagingSenderId: "874949379651",
  appId: "1:874949379651:web:16b06ddba2715ac511b6f6",
  measurementId: "G-8S9BMC5WL5"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

function ProposalPdf() {
  const [fileUpload, setFileUpload] = useState(null);
  const [pdfUrl, setPdfUrl] = useState('');
  const [price, setPrice] = useState(0);
  const [fileName, setFileName] = useState('');
  const { id } = useParams();

  const fileUploadRef = ref(storage, "file/");
  const token = Cookies.get('token'); // Trích xuất token từ cookie
  const navigate = useNavigate();

  const uploadFile = () => {
    if (fileUpload === null) {
      alert("Please select a file");
      return;
    }

    const fileRef = ref(storage, `file/${fileUpload.name}_${uuidv4()}`);
    uploadBytes(fileRef, fileUpload)
      .then(() => {
        console.log("File uploaded successfully");
        listAllFiles();
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
      });
  };
  const handleBackToList = async () => {
    try {
      await fetch(`http://localhost:8080/api/v1/request/auth/${id}/lock`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    //   setShowForm(false);
      navigate('/staff/proposalList'); // Redirect to proposalList
    } catch (error) {
      console.error('Error locking request:', error);
    }
  };
  const listAllFiles = () => {
    listAll(fileUploadRef)
      .then((response) => {
        response.items.forEach((item) => {
          getDownloadURL(item)
            .then((url) => {
              setPdfUrl(url);
            })
            .catch((error) => {
              console.error("Error getting download URL:", error);
            });
        });
      })
      .catch((error) => {
        console.error("Error listing files:", error);
      });
  };

  const adjustProposal = () => {
    if (!pdfUrl) {
      alert("No PDF uploaded yet");
      return;
    }

    const requestBody = {
        filename: fileName, // Use fileName state for file name
        filePath: pdfUrl,
        price: price
      };

    fetch(`http://localhost:8080/api/v1/request/auth/${id}/uploadProposal`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Thêm token vào tiêu đề
      },
      body: JSON.stringify(requestBody)
    })
    .then(response => {
      if (response.ok) {
        alert("Proposal adjusted successfully");
        navigate('/staff/proposalList'); 
      } else {
        throw new Error('Failed to adjust proposal');
      }
    })
    .catch(error => {
      console.error('Error adjusting proposal:', error);
    });
  };

  return (
    <div className='proposalBox'>
        <div className="fileUploadBox">
            <input type="file" onChange={(event) => { setFileUpload(event.target.files[0]) }} />
            <button className='buttonUpload' onClick={uploadFile}>Upload File</button>

        </div>
        <div className="mainConttentBox">
        <label htmlFor="fileNameInput">File Name:</label>
            <input id="fileNameInput" className='fileNameInput'
                type="text"
                value={fileName}
                onChange={(event) => setFileName(event.target.value)}
                placeholder="Enter File Name"
            />
            <label htmlFor="priceInput">Standard Price:</label>
            <input id="priceInput" className='priceInput'
                type="number"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                placeholder="Enter Price"
            />

        </div>
    
      <button className='buttonAdjust' onClick={adjustProposal}>Save</button>
      
      <button className='back-button' onClick={handleBackToList}>Back to List</button>
    
      
      {pdfUrl && (
        <iframe className='pdfBox' src={pdfUrl} title="PDF Viewer" width="80%" height="500px" />
      )}
    </div>
  );
}

export default ProposalPdf;

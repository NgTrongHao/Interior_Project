import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, listAll, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import Cookies from 'js-cookie'; // Import thư viện Cookies để truy cập vào cookie
import './ProposalPdf.css';
import { useParams } from 'react-router-dom'; // Import useParams để trích xuất id từ URL param
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

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
  const [showUrl, setShowUrl] = useState('');

  const fileUploadRef = ref(storage, "file/");
  const token = Cookies.get('token'); // Trích xuất token từ cookie
  const navigate = useNavigate();

  // const uploadFile = () => {
  //   if (fileUpload === null) {
  //     alert("Please select a file");
  //     return;
  //   }

  //   const fileRef = ref(storage, `file/${fileUpload.name}_${uuidv4()}`);
  //   uploadBytes(fileRef, fileUpload)
  //     .then(() => {
  //       console.log("File uploaded successfully");
  //       listAllFiles();
  //     })
  //     .catch((error) => {
  //       console.error("Error uploading file:", error);
  //     });
  // };

  const uploadFile = async () => {
    console.log(fileUpload);
    const storageRef = ref(storage, `file/${fileUpload.name}_${uuidv4()}`);
    const response = await uploadBytes(storageRef, fileUpload);
    const downloadURL = await getDownloadURL(response.ref);
    setShowUrl(downloadURL);
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
      navigate('/staff'); // Redirect to proposalList
    } catch (error) {
      console.error('Error locking request:', error);
    }
  };

  const listAllFiles = () => {
    listAll(fileUploadRef)
      .then((response) => {
        const urls = []; // Tạo một mảng để tích lũy các URL
        response.items.forEach((item) => {
          getDownloadURL(item)
            .then((url) => {
              urls.push(url); // Thêm URL vào mảng
            })
            .catch((error) => {
              console.error("Error getting download URL:", error);
            });
        });
        // Sau khi tất cả các URL đã được thu thập, gán mảng URL cho pdfUrl
        setPdfUrl(urls);
        console.log("url: ", urls);
      })
      .catch((error) => {
        console.error("Error listing files:", error);
      });
  };


  const adjustProposal = async () => {
    // if (!pdfUrl || pdfUrl.length === 0) {
    //   alert("No PDF uploaded yet");
    //   return;
    // }

    // const lastPdfUrl = pdfUrl[pdfUrl.length - 1];
    // console.log('id: ', id);
    // console.log("last link", lastPdfUrl);

    // setShowUrl(lastPdfUrl);

    console.log("Show URL: ", showUrl);
    const parsedPrice = parseFloat(price);

    const requestBody = {
      file_name: fileName, // Use fileName state for file name
      file_path: showUrl,
      price: parsedPrice
    };

    console.log("request body", requestBody);

    await axios.patch(`http://localhost:8080/api/v1/request/auth/${id}/uploadProposal`, requestBody, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        alert("Proposal adjusted successfully");
        navigate('/staff');
      })
      .catch(error => {
        console.error('Error adjusting proposal:', error);
      });

  };

  return (
    <div className='proposalBox m-10'>
      <div className="fileUploadBox flex">
        <input type="file" onChange={(event) => { setFileUpload(event.target.files[0]) }} />
        <button className='buttonUpload text-3xl'  onClick={uploadFile}>Tải File</button>

      </div>
      <div className="mainConttentBox text-3xl flex-start flex left-0 border-2 border-green-600">
        <label htmlFor="fileNameInput">Tên file:</label>
        <input id="fileNameInput" className='fileNameInput'
          type="text"
          value={fileName}
          onChange={(event) => setFileName(event.target.value)}
          placeholder="Enter File Name"
        />
        <label htmlFor="priceInput">Giá dự thảo:</label>
        <input id="priceInput" className='priceInput'
          type="number"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          placeholder="Enter Price"
        />

      </div>
<div className="flex justify-between">

      <button className='buttonAdjust' onClick={adjustProposal}>Lưu</button>

      <button className='p-3 bg-yellow-400 text-3xl w-1/6 m-6 rounded-xl' onClick={handleBackToList}>Quay lại</button>
</div>

      {
        showUrl && (
          <iframe className='pdfBox' src={showUrl} title="PDF Viewer" width="80%" height="500px" />
        )
      }

    </div>
  );
}

export default ProposalPdf;

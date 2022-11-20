import React, { useState } from 'react';
import Grid from "@material-ui/core/Grid";
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios';
import './App.css';

function App() {
  const [filedata, setFiledata] = useState();
  const [mg_status, setMg_status] = useState()
  const [message, setMessage] = useState();
  const [progress, setProgress] = useState();

  const handleChange = (event) => {
    setFiledata(event.target.files[0]);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('file_url', filedata ? filedata : '');
    const config = {
      headers: {
        'content-type': 'multipart/form-data',
      },
    };
    setProgress(true)
    axios.post('/logs/import', formData, config).then((response) => {

      var output = response.data;
      if (output.error) {
        console.log('errrrrrrr-------', output);
        setProgress(false)
        setMg_status(false)
        setMessage(output.error_description)
        return
      } else {
        console.log('successss------', response.data);
        setProgress(false)
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(response.data));
        var dlAnchorElem = document.getElementById('downloadAnchorElem');
        dlAnchorElem.setAttribute("href", dataStr);
        dlAnchorElem.setAttribute("download", "scene.json");
        dlAnchorElem.click();
      }
    }).catch((err) => {
      console.log('errrrrrrr-------', err);
      setProgress(false)
      setMg_status(false)
      setMessage(err.error_description)
      return
    });
  };
  return (
    <div className="Appcenter">

      <Grid item container style={{ paddingTop: "25px", textAlign: 'center' }}>
        <Grid sm={12}>
          <h1>LOGS</h1>
        </Grid>
        <Grid sm={12} style={{ paddingTop: 20 }}>
          <input style={{ display: 'inline' }} type="file" accept="log/*" id="file_url" name="file_url" onChange={handleChange} />
        </Grid>
        <Grid sm={12} style={{ paddingTop: 20 }}>
          <Button  className="btn-choose" variant="contained" onClick={handleSubmit}>
            {progress?<CircularProgress size={20} color="secondary" />:"Upload"}
          </Button>
        </Grid>
        <Grid sm={12} style={{ paddingTop: 20 }}>
          {mg_status ?
            <p style={{ color: 'green' }}>{message}</p>
            :
            <p style={{ color: 'red' }}>{message}</p>
          }
          <a id="downloadAnchorElem" style={{display:"none"}}></a>
        </Grid>
      </Grid>
    </div>
  );
}

export default App;

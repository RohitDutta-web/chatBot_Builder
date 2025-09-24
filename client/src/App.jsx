import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, TextField, Button, Box, 
  Paper, Grid, Card, CardContent, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Snackbar, Alert
} from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import axios from 'axios';

const ChatflowBuilder = () => {
  const [chatflows, setChatflows] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentFlow, setCurrentFlow] = useState({
    name: '',
    triggers: '',
    nodes: []
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchChatflows();
  }, []);

  const fetchChatflows = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/chatFlow`);
        console.log("API raw response:", response);
      setChatflows(response.data);
    } catch (err) {
      console.error('Error fetching chatflows:', err);
      setSnackbar({ open: true, message: 'Failed to fetch chatflows', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentFlow._id) {
        await axios.put(`${import.meta.env.VITE_BACKEND_URL}/chatFlow/${currentFlow._id}`, currentFlow);
        setSnackbar({ open: true, message: 'Chatflow updated successfully', severity: 'success' });
      } else {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/chatFlow`, currentFlow);
        setSnackbar({ open: true, message: 'Chatflow created successfully', severity: 'success' });
      }
      setOpen(false);
      setCurrentFlow({ name: '', trigger: '', nodes: [] });
      fetchChatflows();
    } catch (err) {
      console.error('Error saving chatflow:', err);
      setSnackbar({ open: true, message: 'Failed to save chatflow', severity: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this chatflow?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/chatflows/${id}`);
      setSnackbar({ open: true, message: 'Chatflow deleted successfully', severity: 'success' });
      fetchChatflows();
    } catch (err) {
      console.error('Error deleting chatflow:', err);
      setSnackbar({ open: true, message: 'Failed to delete chatflow', severity: 'error' });
    }
  };

  const addNode = () => {
    const newNode = {
      id: Date.now().toString(),
      type: 'text',
      message: '',
      options: []
    };
    setCurrentFlow({
      ...currentFlow,
      nodes: [...currentFlow.nodes, newNode]
    });
  };

  const updateNode = (index, field, value) => {
    const updatedNodes = [...currentFlow.nodes];
    updatedNodes[index] = { ...updatedNodes[index], [field]: value };
    setCurrentFlow({ ...currentFlow, nodes: updatedNodes });
  };

  const deleteNode = (index) => {
    const updatedNodes = currentFlow.nodes.filter((_, i) => i !== index);
    setCurrentFlow({ ...currentFlow, nodes: updatedNodes });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Chatflow Builder</Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />} 
          onClick={() => setOpen(true)}
        >
          Create Chatflow
        </Button>
      </Box>

      <Grid container spacing={3}>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : chatflows.length > 0 ? (
          chatflows.map((flow) => (
            <Grid item xs={12} md={6} key={flow._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{flow.name}</Typography>
                  <Typography color="textSecondary">Trigger: {flow.triggers}</Typography>
                  <Typography>Nodes: {flow.nodes?.length || 0}</Typography>
                  <Box mt={2}>
                    <Button 
                      size="small" 
                      startIcon={<Edit />} 
                      onClick={() => { setCurrentFlow(flow); setOpen(true); }}
                    >
                      Edit
                    </Button>
                    <Button 
                      size="small" 
                      color="error" 
                      startIcon={<Delete />} 
                      onClick={() => handleDelete(flow._id)}
                    >
                      Delete
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography>No chatflows found</Typography>
        )}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{currentFlow._id ? 'Edit Chatflow' : 'Create Chatflow'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Flow Name"
            value={currentFlow.name}
            onChange={(e) => setCurrentFlow({...currentFlow, name: e.target.value})}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Trigger Message"
            value={currentFlow.trigger}
            onChange={(e) => setCurrentFlow({...currentFlow, trigger: e.target.value})}
            sx={{ mt: 2 }}
          />

          <Typography variant="h6" sx={{ mt: 3 }}>Nodes</Typography>
          {currentFlow.nodes.map((node, index) => (
            <Paper key={node.id} sx={{ p: 2, mt: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={3}>
                  <TextField
                    select
                    fullWidth
                    label="Type"
                    value={node.type}
                    onChange={(e) => updateNode(index, 'type', e.target.value)}
                    SelectProps={{ native: true }}
                  >
                    <option value="text">Text</option>
                    <option value="buttons">Buttons</option>
                    <option value="media">Media</option>
                  </TextField>
                </Grid>
                <Grid item xs={7}>
                  <TextField
                    fullWidth
                    label="Message"
                    value={node.message}
                    onChange={(e) => updateNode(index, 'message', e.target.value)}
                  />
                </Grid>
                <Grid item xs={2}>
                  <IconButton onClick={() => deleteNode(index)} color="error">
                    <Delete />
                  </IconButton>
                </Grid>
              </Grid>
            </Paper>
          ))}

          <Button onClick={addNode} startIcon={<Add />} sx={{ mt: 2 }}>
            Add Node
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ChatflowBuilder;

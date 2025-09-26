import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip, TextField, Button, Box, Grid,
  Card, CardContent, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, Snackbar, Alert
} from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import axios from 'axios';

// ================= ExecutionLogs Component =================
export const ExecutionLogs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/logs`);
      setLogs(response.data.data);
    } catch (err) {
      console.error('Error fetching logs:', err);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" mb={3}>Execution Logs</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User ID</TableCell>
              <TableCell>Trigger</TableCell>
              <TableCell>Nodes Executed</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Timestamp</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log._id}>
                <TableCell>{log.userId}</TableCell>
                <TableCell>{log.trigger}</TableCell>
                <TableCell>{log.flow?.length || 0}</TableCell>
                <TableCell>
                  <Chip
                    label={log.status}
                    color={log.status === 'success' ? 'success' : 'error'}
                  />
                </TableCell>
                <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

// ================= ChatflowBuilder Component =================
export const ChatflowBuilder = () => {
  const [chatflows, setChatflows] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentFlow, setCurrentFlow] = useState({ name: '', trigger: '', nodes: [] });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchChatflows();
  }, []);

  const fetchChatflows = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/chatFlow`);
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
      const existingChatFlow = chatflows.find((chat) => chat._id === currentFlow._id);
      if (existingChatFlow) {
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
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/chatFlow/${id}`);
      setSnackbar({ open: true, message: 'Chatflow deleted successfully', severity: 'success' });
      fetchChatflows();
    } catch (err) {
      console.error('Error deleting chatflow:', err);
      setSnackbar({ open: true, message: 'Failed to delete chatflow', severity: 'error' });
    }
  };

  const addNode = () => {
    const newNode = { id: Date.now().toString(), type: 'text', message: '', mediaUrl: '', options: [] };
    setCurrentFlow({ ...currentFlow, nodes: [...currentFlow.nodes, newNode] });
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
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>
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
                  <Typography color="textSecondary">Trigger: {flow.trigger}</Typography>
                  <Typography>Nodes: {flow.nodes?.length || 0}</Typography>
                  <Box mt={2}>
                    <Button size="small" startIcon={<Edit />} onClick={() => { setCurrentFlow(flow); setOpen(true); }}>
                      Edit
                    </Button>
                    <Button size="small" color="error" startIcon={<Delete />} onClick={() => handleDelete(flow._id)}>
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
            onChange={(e) => setCurrentFlow({ ...currentFlow, name: e.target.value })}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Trigger Message"
            value={currentFlow.trigger}
            onChange={(e) => setCurrentFlow({ ...currentFlow, trigger: e.target.value })}
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
                  {node.type === 'media' ? (
                    <TextField
                      fullWidth
                      label="Media URL"
                      value={node.mediaUrl || ''}
                      onChange={(e) => updateNode(index, 'mediaUrl', e.target.value)}
                    />
                  ) : (
                    <TextField
                      fullWidth
                      label="Message"
                      value={node.message}
                      onChange={(e) => updateNode(index, 'message', e.target.value)}
                    />
                  )}
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

// ================= Optional Parent Component =================
// If you want to show both components on the same page
const AdminDashboard = () => (
  <>
    <ExecutionLogs />
    <ChatflowBuilder />
  </>
);

export default AdminDashboard;

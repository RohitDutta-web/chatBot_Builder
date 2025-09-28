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
  const [selectedLog, setSelectedLog] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

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
              <TableCell>Details</TableCell>
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
                <TableCell>{
                  log.startedAt ? new Date(log.startedAt).toLocaleString() :
                    log.endedAt ? new Date(log.endedAt).toLocaleString() :
                      log.createdAt ? new Date(log.createdAt).toLocaleString() :
                        ''
                }</TableCell>
                <TableCell>
                  <Button size="small" variant="outlined" onClick={() => { setSelectedLog(log); setDetailsOpen(true); }}>View</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Execution Details</DialogTitle>
        <DialogContent>
          {selectedLog && (
            <Box>
              <Typography variant="subtitle1" mb={2}>User ID: {selectedLog.userId}</Typography>
              <Typography variant="subtitle1" mb={2}>Trigger: {selectedLog.trigger}</Typography>
              <Box mt={2} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {selectedLog.flow?.map((node, idx) => {
                  let nextNode = null;
                  if (node.next) {
                    nextNode = selectedLog.flow.find(n => n.nodeId === node.next || n.id === node.next);
                  }
                  // Success/failure icon
                  let statusIcon = null;
                  if (node.status === "sent") statusIcon = <span style={{ color: 'green', fontSize: 22 }}>✔️</span>;
                  else if (node.status === "failed") statusIcon = <span style={{ color: 'red', fontSize: 22 }}>❌</span>;
                  else statusIcon = <span style={{ color: 'orange', fontSize: 22 }}>⏳</span>;
                  return (
                    <React.Fragment key={idx}>
                      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <Paper sx={{ p: 2, mb: 0, minWidth: 350, maxWidth: 500, borderLeft: '4px solid #1976d2', boxShadow: 3, position: 'relative' }}>
                          <Box sx={{ position: 'absolute', top: 10, right: 16 }}>{statusIcon}</Box>
                          <Typography variant="body2" color="textSecondary">Node {idx + 1} <b>({node.type})</b></Typography>
                          <Typography variant="body2" color="textSecondary">Node ID: <b>{node.nodeId || node.id}</b></Typography>
                          {node.message && <Typography variant="body1" sx={{ mt: 1 }}>Message: {node.message}</Typography>}
                          {node.options && node.options.length > 0 && (
                            <Box sx={{ mt: 1 }}>
                              <Typography variant="body2">Options:</Typography>
                              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                {node.options.map((opt, i) => (
                                  <Chip key={i} label={typeof opt === 'string' ? opt : opt.label || opt} color="primary" sx={{ fontWeight: 'bold', bgcolor: '#e3f2fd', border: '1px solid #1976d2' }} />
                                ))}
                              </Box>
                              {/* Branching visualization */}
                              <Box sx={{ mt: 1, ml: 2 }}>
                                {node.options.map((opt, i) => {
                                  const nextId = typeof opt === 'string' ? undefined : opt.next;
                                  if (!nextId) return null;
                                  const branchNode = selectedLog.flow.find(n => n.nodeId === nextId || n.id === nextId);
                                  return (
                                    <Typography key={i} variant="body2" sx={{ color: branchNode ? 'green' : 'red', fontWeight: 'bold' }}>
                                      ↳ {opt.label || opt} → {nextId} {branchNode ? '(executed)' : '(not executed)'}
                                    </Typography>
                                  );
                                })}
                              </Box>
                            </Box>
                          )}
                          {node.userReply && (
                            <Box sx={{ mt: 1 }}>
                              <Typography variant="body2" sx={{ bgcolor: '#fffde7', p: 1, borderRadius: 1, fontWeight: 'bold', color: '#f57c00' }}>User Reply: <b>{node.userReply}</b></Typography>
                            </Box>
                          )}
                          {node.next && (
                            <Box sx={{ mt: 1 }}>
                              <Typography variant="body2" color={nextNode ? "primary" : "error"}>
                                Next Node: <b>{node.next}</b> {nextNode ? "(executed)" : "(not executed)"}
                              </Typography>
                            </Box>
                          )}
                          {node.timestamp && (
                            <Box sx={{ mt: 1 }}>
                              <Typography variant="body2" color="textSecondary">Timestamp: {new Date(node.timestamp).toLocaleString()}</Typography>
                            </Box>
                          )}
                        </Paper>
                      </Box>
                      {idx < selectedLog.flow.length - 1 && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 0 }}>
                          <Typography variant="h4" color="primary" sx={{ mb: -1, mt: -1 }}>↓</Typography>
                        </Box>
                      )}
                    </React.Fragment>
                  );
                })}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

// ================= ChatflowBuilder Component =================
export const ChatflowBuilder = () => {
  const [chatflows, setChatflows] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentFlow, setCurrentFlow] = useState({ name: '', triggers: [''], nodes: [] });
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
      setCurrentFlow({ name: '', triggers: [''], nodes: [] });
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
    const newNode = {
      id: Date.now().toString(),
      type: 'text',
      message: '',
      mediaType: 'image',
      mediaUrl: '',
      options: [],
      next: ''
    };
    setCurrentFlow({ ...currentFlow, nodes: [...currentFlow.nodes, newNode] });
  }

  const updateNode = (index, field, value) => {
    const updatedNodes = [...currentFlow.nodes];
    updatedNodes[index] = { ...updatedNodes[index], [field]: value };
    setCurrentFlow({ ...currentFlow, nodes: updatedNodes });
  };

  const addOptionToNode = (nodeIndex) => {
    const updatedNodes = [...currentFlow.nodes];
    updatedNodes[nodeIndex].options = updatedNodes[nodeIndex].options || [];
    updatedNodes[nodeIndex].options.push({ label: '', next: '' });
    setCurrentFlow({ ...currentFlow, nodes: updatedNodes });
  };

  const updateOption = (nodeIndex, optionIndex, field, value) => {
    const updatedNodes = [...currentFlow.nodes];
    updatedNodes[nodeIndex].options[optionIndex][field] = value;
    setCurrentFlow({ ...currentFlow, nodes: updatedNodes });
  };

  const deleteOption = (nodeIndex, optionIndex) => {
    const updatedNodes = [...currentFlow.nodes];
    updatedNodes[nodeIndex].options.splice(optionIndex, 1);
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
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">Trigger Messages</Typography>
            {currentFlow.triggers.map((trigger, idx) => (
              <Box key={idx} display="flex" alignItems="center" mb={1}>
                <TextField
                  label={`Trigger ${idx + 1}`}
                  value={trigger}
                  onChange={e => {
                    const updated = [...currentFlow.triggers];
                    updated[idx] = e.target.value;
                    setCurrentFlow({ ...currentFlow, triggers: updated });
                  }}
                  sx={{ mr: 1 }}
                />
                <IconButton
                  color="error"
                  onClick={() => {
                    const updated = currentFlow.triggers.filter((_, i) => i !== idx);
                    setCurrentFlow({ ...currentFlow, triggers: updated.length ? updated : [''] });
                  }}
                  disabled={currentFlow.triggers.length === 1}
                >
                  <Delete />
                </IconButton>
              </Box>
            ))}
            <Button onClick={() => setCurrentFlow({ ...currentFlow, triggers: [...currentFlow.triggers, ''] })} startIcon={<Add />}>Add Trigger</Button>
          </Box>

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
                    <option value="quick_reply">Quick Reply</option>
                  </TextField>
                </Grid>
                <Grid item xs={7}>
                  {node.type === 'media' ? (
                    <Box display="flex" gap={2}>
                      <TextField
                        select
                        label="Media Type"
                        value={node.mediaType || 'image'}
                        onChange={e => updateNode(index, 'mediaType', e.target.value)}
                        SelectProps={{ native: true }}
                        sx={{ width: 120 }}
                      >
                        <option value="image">Image</option>
                        <option value="video">Video</option>
                        <option value="file">File</option>
                      </TextField>
                      <TextField
                        fullWidth
                        label="Media URL"
                        value={node.mediaUrl || ''}
                        onChange={e => updateNode(index, 'mediaUrl', e.target.value)}
                      />
                    </Box>
                  ) : (
                    <TextField
                      fullWidth
                      label="Message"
                      value={node.message}
                      onChange={e => updateNode(index, 'message', e.target.value)}
                    />
                  )}
                </Grid>
                <Grid item xs={12}>
                  {(node.type === 'buttons' || node.type === 'quick_reply') && (
                    <Box>
                      <Typography variant="subtitle2">Options</Typography>
                      {node.options?.map((opt, optIdx) => (
                        <Box key={optIdx} display="flex" alignItems="center" mb={1}>
                          <TextField
                            label="Label"
                            value={opt.label}
                            onChange={e => updateOption(index, optIdx, 'label', e.target.value)}
                            sx={{ mr: 1 }}
                          />
                          <TextField
                            label="Next Node ID"
                            value={opt.next}
                            onChange={e => updateOption(index, optIdx, 'next', e.target.value)}
                            sx={{ mr: 1 }}
                          />
                          <IconButton color="error" onClick={() => deleteOption(index, optIdx)}>
                            <Delete />
                          </IconButton>
                        </Box>
                      ))}
                      <Button onClick={() => addOptionToNode(index)} startIcon={<Add />}>Add Option</Button>
                    </Box>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Next Node ID (for sequential flow)"
                    value={node.next || ''}
                    onChange={e => updateNode(index, 'next', e.target.value)}
                    fullWidth
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

const AdminDashboard = () => (
  <>
    <ExecutionLogs />
    <ChatflowBuilder />
  </>
);

export default AdminDashboard;

import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Container,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4)
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3)
}));

function MedicalHistory() {
  const [history] = useState([
    {
      id: 1,
      title: 'Initial Consultation',
      date: '2024-03-15',
      description: 'First visit for symptoms assessment'
    },
    {
      id: 2,
      title: 'Follow-up Visit',
      date: '2024-03-20',
      description: 'Review of treatment progress'
    }
  ]);

  return (
    <StyledContainer>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <List>
            {history.map((item, index) => (
              <React.Fragment key={item.id}>
                <ListItem>
                  <ListItemText 
                    primary={item.title}
                    secondary={
                      <>
                        <Typography component="span" color="textSecondary">
                          {item.date}
                        </Typography>
                        <Typography component="p">
                          {item.description}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                {index < history.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Grid>
      </Grid>
    </StyledContainer>
  );
}

export default MedicalHistory;

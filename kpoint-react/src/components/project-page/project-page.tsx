import AddIcon from '@mui/icons-material/Add';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Box, Chip, Paper, Tab, Tabs } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { ProjectType } from 'common/types/projects/project.type';
import logo from 'logo.jpg';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { CustomTabPanel } from '../../utils/function-custom-tab-panel';
import { generateGoogleMapsLink } from '../../utils/function-generate-google-maps-link';
import { getSocialMediaIcon } from '../../utils/function-social-media-icons';
import { CustomTimeline } from '../common/common';

interface ProjectPageProps {
  project: ProjectType;
  allStatuses: string[];
}

function getTabAccessibilityProps(index: number): { id: string, 'aria-controls': string } {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const ProjectPage: FC<ProjectPageProps> = ({ project, allStatuses }) => {

  const { t } = useTranslation();
  const projectImage: string = project.logoImgUrl === null ? { logo }.logo
    : `data:image/png;base64,${project.logoImgUrl}`;

  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number): void => {
    setValue(newValue);
  };

  return (
    <Paper>
      <Paper
        sx={{
          p: 2,
          margin: 'auto',
          bgcolor: '#A8A8A9',
        }}
      >
        <Paper
          sx={{
            p: 2,
            margin: 'auto',
            bgcolor: '#A8A8A9',
            maxWidth: 900,
            minHeight: 284,
            flexGrow: 1,
          }}
        >
          {/*button subscribe, social media links*/}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button
              size="large"
              sx={{
                fontFamily: 'Roboto',
                fontSize: '14px',
                fontWeight: 500,
                lineHeight: '14px',
                letterSpacing: '0px',
                textAlign: 'left',
                backgroundImage: 'linear-gradient(0deg, #FFFFFF, #FFFFFF)',
                color: '#828282',
              }}
            >
              <AddIcon />
              {t('buttons.subscribe')}
            </Button>
            <Typography variant="subtitle1" component="div">
              {Object.entries(project.networksLinks).map(([network, link]) => (
                <Link key={network} href={link} underline="none" color="white">
                  {getSocialMediaIcon(network)}
                </Link>
              ))}
            </Typography>
          </Box>
          {/* paper fpr spase  */}
          <Paper
            sx={{
              p: 2,
              margin: 'auto',
              bgcolor: '#A8A8A9',
              maxWidth: 900,
              maxHeight: 20,
              opacity: 0, // makes in invisible but present
            }}
          >
          </Paper>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Grid container spacing={3}>
              {/* Left Part: Logo, Chips */}
              <Grid item>
                <Card>
                  <CardMedia
                    component="img"
                    height="194"
                    image={projectImage}
                    alt="Logo"
                  />
                </Card>
                <Grid item sx={{ margin: '10px 0' }}>
                  {project.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      variant="outlined"
                      sx={{
                        fontFamily: 'Roboto',
                        fontWeight: 400,
                        fontSize: '13px',
                        lineHeight: '18px',
                        letterSpacing: '0.16px',
                        color: '#4F4F4F',
                        margin: '5px',
                      }}
                    />
                  ))}
                </Grid>
              </Grid>
              {/* Project title, google maps link*/}
              <Grid item xs={12} sm container>
                <Grid item xs container direction="column" spacing={2}>
                  <Grid item xs>
                    <Typography gutterBottom variant="subtitle1" component="div"
                      sx={{
                        fontFamily: 'Roboto',
                        fontSize: '32px',
                        fontWeight: 700,
                        lineHeight: '32px',
                        letterSpacing: '1px',
                        textAlign: 'left',
                        color: '#001D6C',
                      }}
                    >
                      {project.title}
                    </Typography>
                    <Link
                      href={generateGoogleMapsLink(project)}
                      underline="none"
                      sx={{
                        fontFamily: 'Roboto',
                        fontWeight: 500,
                        fontSize: '14px',
                        lineHeight: '14px',
                        letterSpacing: '0.5px',
                        color: '#828282',
                        p: 1,
                        borderRadius: '4px',
                        display: 'inline-block',
                      }}
                    >
                      {t('country')}
                    </Link>
                  </Grid>
                </Grid>
              </Grid>

              {/* Right Part: Buttons donate, support*/}
              <Grid item>
                <Box sx={{ marginTop: 20 }}>
                  <Grid container direction="column" justifyContent="flex-end" alignItems="flex-end">
                    <Box>
                      <Button
                        size="large"
                        sx={{
                          fontFamily: 'Roboto',
                          fontSize: '14px',
                          fontWeight: 500,
                          lineHeight: '14px',
                          letterSpacing: '0px',
                          textAlign: 'left',
                          backgroundImage: 'linear-gradient(0deg, #FFFFFF, #FFFFFF)',
                          color: '#828282',
                          marginBottom: '10px',
                          width: '250px',
                        }}
                      >
                        <PersonAddIcon />
                        {t('buttons.support')}</Button>
                    </Box>
                    <Box>
                      <Button
                        size="large"
                        sx={{
                          fontFamily: 'Roboto',
                          fontSize: '14px',
                          fontWeight: 500,
                          lineHeight: '14px',
                          letterSpacing: '0px',
                          textAlign: 'left',
                          backgroundImage: 'linear-gradient(0deg, #FFFFFF, #FFFFFF)',
                          color: '#828282',
                          width: '250px',
                        }}
                      >
                        <AttachMoneyIcon />
                        {t('buttons.donate')}</Button>
                    </Box>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Paper>
      <Paper
        sx={{
          p: 2,
          margin: 'auto',
          bgcolor: 'white',
          maxWidth: 900,
          mixHeight: 284,
          flexGrow: 1,
        }}
      >
        <Grid container spacing={0}>
          {/* Left Column Description */}
          <Grid item xs={8}>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ width: '100%' }}>
                <Tabs value={value} onChange={handleChange} aria-label="nav tabs example">
                  <Tab label={t('about')} {...getTabAccessibilityProps(0)} />
                  <Tab label={t('team')} {...getTabAccessibilityProps(1)} />
                  <Tab label={t('help_project')} {...getTabAccessibilityProps(2)} />
                  <Tab label={t('comments')} {...getTabAccessibilityProps(3)} />
                </Tabs>
              </Box>
              <CustomTabPanel value={value} index={0}>
                <Box fontWeight="fontWeightBold">{t('description')}:</Box>
                {'\n'}
                {project.description}
              </CustomTabPanel>
              <CustomTabPanel value={value} index={1}>
                <Box fontWeight="fontWeightBold">{t('team')}:</Box>
              </CustomTabPanel>
              <CustomTabPanel value={value} index={2}>
                <Box fontWeight="fontWeightBold">{t('help_project')}:</Box>
              </CustomTabPanel>
              <CustomTabPanel value={value} index={3}>
                <Box fontWeight="fontWeightBold">{t('comments')}:</Box>
              </CustomTabPanel>
            </Box>
          </Grid>

          {/* Right Column project state*/}
          <Grid item xs={4}>
            <CustomTimeline allStatuses={allStatuses} currentStatus={project.state} />
          </Grid>
        </Grid>

      </Paper>
    </Paper>
  );
};

export { ProjectPage };


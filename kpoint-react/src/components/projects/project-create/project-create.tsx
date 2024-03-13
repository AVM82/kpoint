import { Box, Button, Container, Paper, Step, StepLabel, Stepper, Typography } from '@mui/material';
import { TestRequest } from 'common/types/projects/testRequest';
import React, { FC, ReactElement, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { projectAction } from 'store/actions';

import { ProjectsEditType } from '../../../common/types/types';
import { useAppDispatch } from '../../../hooks/hooks';
import { ProjectCreateStep1Form } from './components/project-create-step-1';
import { ProjectCreateStep2Form } from './components/project-create-step-2';
import { ProjectCreateStep3Form } from './components/project-create-step-3';
import { projectDefault } from './components/project-default';

export const ProjectCreate: FC = () => {
  const { t } = useTranslation();

  const steps: string[] = [
    t('general_information'),
    t('about'),
    t('implementation_plan'),
  ];

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [activeStep, setActiveStep] = useState(1);

  const [projectData, setProjectData] =
    useState<ProjectsEditType>(projectDefault);

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.backgroundColor = '#E4E5E9';
  }, []);
  const handleNext = (): void => {
    const validationErrors = validateForm(projectData);

    if (Object.keys(validationErrors).length === 0) {
      setErrors({});
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      setErrors(validationErrors);
    }

    const testData: TestRequest = {
      file: projectData.logo ? projectData.logo : '',
      createdProject:
        {
          title: projectData.title,
          url: projectData.url,
          summary: projectData.summary,
          description: projectData.description,
          tags: projectData.tags,
          goalDeadline: projectData.goalDeadline,
          collectDeadline: projectData.collectDeadline,
          startSum: projectData.startSum,
          networksLinks: { FACEBOOK: 'https://www.facebook.com/example' },
        },
    };

    if (activeStep === steps.length) {
      dispatch(projectAction.createNew( { testData } ))
        .unwrap()

        .then((action): void => {
          navigate('/projects/' + action.url);
        })
        .catch(() => {
          return;
        });
    }
  };

  const handleBack = (): void => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleChange = (field: string, value: string | File): void => {
    setProjectData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleFieldFocus = (field: string): void => {
    setErrors((prevErrors) => ({ ...prevErrors, [field]: '' }));
  };

  const validateForm = (data: ProjectsEditType): Record<string, string> => {
    const errors: Record<string, string> = {};

    switch (activeStep) {
    case 1: {
      if (!data.title.trim() || data.title.trim().length > 30) {
        errors.title = t('errors.project_title');
      } else if (data.url.trim().length < 5) {
        errors.url = t('errors.project_url');
      } else if (data.tags.length < 1 || data.tags.length > 5) {
        errors.tags = t('errors.project_tags');
      } else if (!data.summary.trim() || data.summary.trim().length > 150) {
        errors.summary = t('errors.project_summary');
      }
      break;
    }
    case 2: {
      if (!data.description.trim() || data.description.trim().length > 3000) {
        errors.description = t('errors.project_description');
      }
      break;
    }
    case 3: {
      if (new Date(data.goalDeadline) < new Date(data.collectDeadline)) {
        errors.deadline = t('errors.project_deadline');
      }
      break;
    }
    }

    return errors;
  };
  const getStepContent = (step: number): ReactElement => {
    switch (step) {
    case 1:
      return (
        <ProjectCreateStep1Form
          projectData={projectData}
          handleChange={handleChange}
          handleFieldFocus={handleFieldFocus}
          errors={errors}
        />
      );
    case 2:
      return (
        <ProjectCreateStep2Form
          projectData={projectData}
          handleChange={handleChange}
          handleFieldFocus={handleFieldFocus}
          errors={errors}
        />
      );
    case 3:
      return (
        <ProjectCreateStep3Form
          projectData={projectData}
          handleChange={handleChange}
          handleFieldFocus={handleFieldFocus}
          errors={errors}
        />
      );
    default:
      throw new Error('Unknown step');
    }
  };

  return (
    <Container component="main" maxWidth="md" sx={{ mb: 4 }}>
      <Box
        display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'ceneter'}>
        <Typography component="h1" variant="h4" align="center" sx={{ p: 2 }}>
          {t('new_project')}
        </Typography>
        <Paper
          variant="outlined"
          sx={{ my: { xs: 3, md: 1 }, p: { xs: 2, md: 3 } }}
        >
          <Stepper activeStep={activeStep - 1} sx={{ pt: 3, pb: 5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep > steps.length ?  <>{setActiveStep(1)}</> : (
            <Box>
              {getStepContent(activeStep)}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                {activeStep !== 1 && (
                  <Button onClick={handleBack} sx={{ mt: 3, ml: 1,
                    backgroundColor: '#535365',
                    color: '#fff',
                    letterSpacing: '1.25px',
                    '&:hover': {
                      backgroundColor: 'rgb(84, 84, 160)',
                    } }}>
                    {t('buttons.back')}
                  </Button>
                )}
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ mt: 3, ml: 1,
                    backgroundColor: '#535365',
                    letterSpacing: '1.25px',                    
                    '&:hover': {
                      backgroundColor: 'rgb(84, 84, 160)',
                    } }}
                >
                  {activeStep === steps.length
                    ? t('buttons.save')
                    : t('buttons.next')}
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

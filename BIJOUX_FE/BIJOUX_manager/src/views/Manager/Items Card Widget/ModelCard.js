import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AspectRatio, Box, Card, CardContent, CardOverflow, Divider, Grid, Typography } from "@mui/joy";
import { Button, IconButton, ButtonGroup, Switch } from "@mui/material";
import { Gear } from "phosphor-react";
import { CModal } from "@coreui/react";
import Model_Switch from "../../component_items/Modal/ModelSwitch";
import ModelActivate from "../Modal_body/ModelActivate";


const ModelCard = (props) => {
  
  return (

    <Card variant="soft" sx={{ width: "100%", height: '100%' }}>
      <CardOverflow sx={{
        padding: 0,
        display: 'flex',
        alignItems: 'center',  // alignItems: 'flex-start', 'flex-end', 'stretch', 'baseline'
        justifyContent: 'center',  // justifyContent: 'center', 'flex-start', 'flex-end', 'space-around', 'space-evenly'
      }}
        color='danger'
      >
        <AspectRatio sx={{ width: "100%" }} variant="soft" objectFit="contain">
          <img
            src={props.imageUrl}
            loading="lazy"
            width={'100%'}
            alt=""
          />
        </AspectRatio>
      </CardOverflow>
      <CardContent sx={{ display: 'flex', flexDirection: 'coumn', alignItems: 'start', justifyContent: 'start' }}  >
        <Typography level="body-sm" display={'inline'}>#{props.id}</Typography>
        <Typography level="title-md" display={'inline'} >{props.name}</Typography>
      </CardContent>
      <CardOverflow variant="soft" >
        <Divider inset="context" />
        <CardContent orientation="horizontal">
          <Grid container spacing={2} sx={{ flexGrow: 1 }} direction="row" justifyContent="flex-start" alignItems="center">
            <Grid item xs={5}>
              <Typography level="body-sm" fontWeight="md" color="textSuccess">
                Type:
              </Typography>
              <Typography level="body-sm" fontWeight="xs" textColor="secondary">
                {props.mounting_type.name}
              </Typography>
            </Grid>
            <Grid item xs={5}>
              <Typography level="body-sm" fontWeight="md" color="textSuccess">
                Style:
              </Typography>
              <Typography level="body-sm" fontWeight="xs" textColor="secondary">
                {props.mounting_style.name}
              </Typography>
            </Grid>
            <Grid item xs={2} padding={0}>
              <ButtonGroup orientation="vertical">
                <IconButton color="secondary" aria-label="add an alarm">
                  <Gear size={20} color={'purple'} weight="duotone" />
                </IconButton>
                <Model_Switch 
                  modelInfo={props} 
                  color="success" 
                  title={(props.deactivated == 0 ? 'Deactivate':'Activate')+ ' Model [ID: #' + props.id+']'} >
                  <ModelActivate  model={props}  />
                </Model_Switch>
                
              </ButtonGroup>
            </Grid>

          </Grid>




        </CardContent>
      </CardOverflow>
    </Card>
  );
};

export default ModelCard;

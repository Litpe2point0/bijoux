import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AspectRatio, Box, Card, CardContent, CardOverflow, Divider, Grid, Typography } from "@mui/joy";
import { Button, IconButton, ButtonGroup, Switch } from "@mui/material";
import { Gear } from "phosphor-react";
import { CModal } from "@coreui/react";
import Model_Switch from "../../component_items/Modal/ModelSwitch";
import ModelActivate from "../Modal_body/model/ModelActivate";
import ModelModify from "../Modal_body/model/ModelModify";
import Modal_Button from "../../component_items/Modal/ModalButton";
import ModelComplete from "../Modal_body/model/ModelComplete";


const ModelCard = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [model, setModel] = useState(null);
  useEffect(() => {
    setModel(props);
  }, [props]);

  return (

    <Card variant="soft" sx={{ width: "100%", height: '100%', overflow: 'hidden' }}>
      {model != null &&
        <>
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
                src={model.imageUrl}
                loading="lazy"
                width={'100%'}
                alt=""
              />
            </AspectRatio>
          </CardOverflow>
          <CardContent sx={{ display: 'flex', flexDirection: 'coumn', alignItems: 'start', justifyContent: 'start' }}  >
            <Typography level="body-sm" display={'inline'}>#{model.id}</Typography>
            <Typography level="title-md" display={'inline'} >{model.name}</Typography>
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
                    {model.mounting_type.name}
                  </Typography>
                </Grid>
                <Grid item xs={5}>
                  <Typography level="body-sm" fontWeight="md" color="textSuccess">
                    Style:
                  </Typography>
                  <Typography level="body-sm" fontWeight="xs" textColor="secondary">
                    {model.mounting_style.name}
                  </Typography>
                </Grid>
                <Grid item xs={2} padding={0}>
                  <ButtonGroup orientation="vertical">
                    <Modal_Button
                      disabled={false}
                      title={"Update Model [ID: #" + model.id + ']'}
                      content={
                        <IconButton color="secondary" aria-label="add an alarm">
                          <Gear size={20} color={'purple'} weight="duotone" />
                        </IconButton>

                      }
                      color={"light"} >
                      <ModelModify type={'update'} modelInfo={model} />
                    </Modal_Button>
                    <Model_Switch
                      modelInfo={model}
                      color="success"
                      title={(model.deactivated == 0 ? 'Deactivate' : 'Activate') + ' Model [ID: #' + model.id + ']'} >
                      <ModelActivate model={model} />
                    </Model_Switch>


                  </ButtonGroup>
                </Grid>
                {!model.isAvailable &&
                  <Grid item xs={12}>
                    <Modal_Button
                      disabled={false}
                      title={"Fill Image To Complete Model [ID: #" + model.id + ']'}
                      content={
                        <Button sx={{ width: '100%' }} variant="contained" color="success">
                          Complete Now
                        </Button>
                      }
                      color={"light"} >
                      <ModelComplete modelInfo={model} />
                    </Modal_Button>

                  </Grid>
                }

              </Grid>




            </CardContent>
          </CardOverflow>
        </>
      }

    </Card>
  );
};

export default ModelCard;

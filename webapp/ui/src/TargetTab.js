import React, { useState } from 'react';
import {
  Button,
  Checkbox, Chip,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton, Tooltip,
  Typography
} from '@mui/material';
import InputSlider from './InputSlider';
import CSVField from './CSVField';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import AddIcon from '@mui/icons-material/Add';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import CSVAutocomplete from './CSVAutocomplete';
import Knob from './Knob';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

const TargetTab = (props) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const onUseCurrentErrorClicked = () => {
    props.onEqParamChanged({
      soundSignature: props.graphData.map(dataPoint => ({
        frequency: dataPoint.frequency,
        raw: props.smoothed ? dataPoint.errorSmoothed : dataPoint.error
      }))
    });
  };

  return (
    <Grid item xs={12} sm={12} container direction='column' rowSpacing={1}>
      <Grid
        item
        container direction='row' justifyContent='space-between' alignItems='center' columnSpacing={1}
        sx={{mb: theme => theme.spacing(1)}}
      >
        {!(props.soundProfiles?.length) > 0 && (
          <Grid item><Typography variant='caption'>Profiles</Typography></Grid>
        )}
        {props.soundProfiles.length > 0 && (
          <Grid item container direction='row' columnSpacing={1} alignItems='center' sx={{width: 'calc(100% - 40px)'}}>
            {props.soundProfiles.map((soundProfile) => (
              <Grid item key={soundProfile.name}>
                <Chip
                  label={soundProfile.name}
                  onClick={() => { props.onSoundProfileSelected(soundProfile.name); }}
                  onDelete={soundProfile.name !== 'Default' ? () => { props.onSoundProfileDeleted(soundProfile.name); } : null}
                  color={props.selectedSoundProfile === soundProfile.name ? 'primary' : 'default'}
                  variant='outlined'
                />
                {props.selectedSoundProfile === soundProfile.name && props.selectedSoundProfile !== 'Default' && (
                  <Tooltip title={`Save current settings to profile ${soundProfile.name}`}>
                    <IconButton
                      onClick={() => props.onSoundProfileSaved(soundProfile.name)}
                      color='default'
                      sx={{p: '4px'}}
                    >
                      <SaveOutlinedIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </Grid>
            ))
            }
          </Grid>
        )}

        <Grid item>
          <Tooltip title='Create new profile with current settings' placement='left'>
            <Button
              variant='outlined'
              sx={{
                minWidth: '32px',
                width: '32px',
                height: '32px',
                borderRadius: '16px',
                padding: 0
              }}
              onClick={() => { props.onSoundProfileCreated(); }}
            >
              <AddIcon variant='outlined' />
            </Button>
          </Tooltip>
        </Grid>
      </Grid>

      {props.compensations?.length > 0 && (
        <Grid item>
          <CSVAutocomplete
            value={props.selectedCompensation}
            options={props.compensations}
            onChange={props.onCompensationSelected}
            onOptionCreated={props.onCompensationCreated}
            onError={props.onError}
            sx={{width: '100%'}}
            label='Target'
            autocompleteProps={{
              disableClearable: true,
              blurOnSelect: true,
              isOptionEqualToValue: (opt, val) => opt.label === val
            }}
          />
        </Grid>
      )}

      <Grid item container direction='row' justifyContent='space-between' sx={{display: showAdvanced ? 'flex' : 'none'}}>
        <Grid item sx={{position: 'relative'}}>
          <CSVField
            label='Sound signature'
            onChange={(dataPoints) => { props.onEqParamChanged({ soundSignature: dataPoints }); }}
            value={props.soundSignature}
            helperText=''
            minRows={5} maxRows={10}
          />
          <Tooltip title='Use current error' placement='left'>
            <IconButton
              variant='outlined' onClick={onUseCurrentErrorClicked}
              disabled={props.graphData.filter(x => props.smoothed ? !!x.errorSmoothed : !!x.error).length === 0}
              sx={{position: 'absolute', top: '80px', right: 0}}
            >
              <HeadphonesIcon />
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid item>
          <Knob
            value={props.soundSignatureSmoothingWindowSize}
            onChange={(val) => { props.onEqParamChanged({ soundSignatureSmoothingWindowSize: val}); }}
            formattedValue={props.soundSignatureSmoothingWindowSize.toFixed(2)}
            minValue={0}
            maxValue={2}
            size={120}
            unit='oct'
            icon={VolumeUpIcon}
            nTicks={9}
            label='Smoothing'
          />
        </Grid>
      </Grid>

      <Grid item container direction='row' columnSpacing={1} rowSpacing={2} justifyContent='space-around'>
        <Grid item>
          <Knob
            value={props.bassBoostGain}
            minValue={0} maxValue={20}
            label='Bass boost'
            onChange={(v) => { props.onEqParamChanged({bassBoostGain: v}) }}
            formattedValue={props.bassBoostGain.toFixed(1)}
            size={120}
            unit='dB'
            nTicks={9}
          />
        </Grid>

        <Grid item sx={{display: showAdvanced ? 'block' : 'none'}}>
          <Knob
            value={props.bassBoostFc}
            minValue={20.0} maxValue={500.0}
            label='Bass freq'
            onChange={(v) => { props.onEqParamChanged({bassBoostFc: v}) }}
            formattedValue={props.bassBoostFc.toFixed(0)}
            size={120}
            unit='Hz'
            nTicks={9}
          />
        </Grid>

        <Grid item sx={{display: showAdvanced ? 'block' : 'none'}}>
          <Knob
            value={props.bassBoostQ}
            minValue={0.3} maxValue={1.0}
            label='Bass quality'
            onChange={(v) => { props.onEqParamChanged({bassBoostQ: v}) }}
            formattedValue={props.bassBoostQ.toFixed(2)}
            size={120}
            nTicks={9}
          />
        </Grid>

        <Grid item>
          <Knob
            value={props.trebleBoostGain}
            minValue={0} maxValue={20}
            label='Treble boost'
            onChange={(v) => { props.onEqParamChanged({trebleBoostGain: v}) }}
            formattedValue={props.trebleBoostGain.toFixed(1)}
            size={120}
            unit='dB'
            nTicks={9}
          />
        </Grid>

        <Grid item sx={{display: showAdvanced ? 'block' : 'none'}}>
          <Knob
            value={props.trebleBoostFc}
            minValue={1000} maxValue={2000}
            label='Treble freq'
            onChange={(v) => { props.onEqParamChanged({trebleBoostFc: v}) }}
            formattedValue={props.trebleBoostFc.toFixed(0)}
            size={120}
            unit='Hz'
            nTicks={9}
          />
        </Grid>

        <Grid item sx={{display: showAdvanced ? 'block' : 'none'}}>
          <Knob
            value={props.trebleBoostQ}
            minValue={1000} maxValue={2000}
            label='Treble quality'
            onChange={(v) => { props.onEqParamChanged({trebleBoostQ: v}) }}
            formattedValue={props.trebleBoostQ.toFixed(2)}
            size={120}
            nTicks={9}
          />
        </Grid>

        <Grid item>
          <Knob
            value={props.maxGain}
            minValue={0} maxValue={30}
            label='Max gain'
            onChange={(v) => { props.onEqParamChanged({maxGain: v}) }}
            formattedValue={props.maxGain.toFixed(1)}
            size={120}
            unit='dB'
            nTicks={9}
          />
        </Grid>

        <Grid item sx={{display: showAdvanced ? 'block' : 'none'}}>
          <Knob
            value={props.tilt}
            minValue={0} maxValue={2}
            label='Tilt'
            onChange={(v) => { props.onEqParamChanged({ tilt: v }) }}
            formattedValue={props.tilt.toFixed(2)}
            size={120}
            unit='dB/oct'
            nTicks={9}
          />
        </Grid>

        <Grid item sx={{display: showAdvanced ? 'block' : 'none'}}>
          <Knob
            value={props.windowSize}
            minValue={0} maxValue={1}
            label='Smoothing window'
            onChange={(v) => { props.onEqParamChanged({ windowSize: v }) }}
            formattedValue={props.windowSize.toFixed(2)}
            size={120}
            unit='oct'
            nTicks={9}
          />
        </Grid>

        <Grid item sx={{display: showAdvanced ? 'block' : 'none'}}>
          <Knob
            value={props.trebleWindowSize}
            minValue={0} maxValue={3}
            label='Treble smoothing'
            onChange={(v) => { props.onEqParamChanged({ trebleWindowSize: v }) }}
            formattedValue={props.trebleWindowSize.toFixed(2)}
            size={120}
            unit='oct'
            nTicks={9}
          />
        </Grid>

        <Grid item sx={{display: showAdvanced ? 'block' : 'none'}}>
          <Knob
            value={props.trebleGainK}
            minValue={0} maxValue={3}
            label='Treble gain multiplier'
            onChange={(v) => { props.onEqParamChanged({ trebleGainK: v }) }}
            formattedValue={props.trebleGainK.toFixed(2)}
            size={120}
            nTicks={9}
          />
        </Grid>

      </Grid>

      <Grid item sx={{display: showAdvanced ? 'block' : 'none'}}>
        <InputSlider
          label='Treble transition region (Hz)' value={[
            props.trebleFLower,
            props.trebleFUpper,
          ]}
          min={1000} max={20000} step={100}
          onChange={(v) => {
            props.onEqParamChanged({ trebleFLower: v[0], trebleFUpper: v[1] })
          }}
        />
      </Grid>

      <Grid item>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                size='small' color='secondary'
                value={showAdvanced}
                onChange={(e, val) => setShowAdvanced(val)}
              />
            }
            label='Show advanced' sx={{color: 'rgba(0, 0, 0, 0.5)'}}
          />
        </FormGroup>
      </Grid>
    </Grid>
  )
};

export default TargetTab;

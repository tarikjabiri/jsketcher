import React from 'react';
import connect from 'ui/connect';
import Fa from 'ui/components/Fa';
import Toolbar, {ToolbarButton} from 'ui/components/Toolbar';
import ImgIcon from 'ui/components/ImgIcon';
import {toIdAndOverrides} from '../../actions/actionRef';
import {mapActionBehavior} from '../../actions/actionButtonBehavior';
import capitalize from 'gems/capitalize';
import decoratorChain from 'ui/decoratorChain';
import {combine, merger} from 'lstream';
import mapContext from '../../../../../modules/ui/mapContext';

function ConfigurableToolbar({actions, small, ...props}) {

  return <Toolbar small={small}>
    {actions.map(actionRef => {
      let [id, overrides] = toIdAndOverrides(actionRef);
      return <ConnectedActionButton actionId={id} key={id} small={small} {...overrides} />
    })}
  </Toolbar>
}

function ActionButton({label, icon96, cssIcons, small, enabled, visible, actionId, ...props}) {
  if (!visible) {
    return null;
  }

  let icon = small ? <Fa fa={cssIcons} fw /> : <ImgIcon url={icon96} size={48} />; 
    
  return <ToolbarButton disabled={!enabled} {...props}>
    {icon}
    {!small && <div>{capitalize(label)}</div>}
  </ToolbarButton>
}

const ConnectedActionButton = decoratorChain(
  connect((streams, {actionId})  => combine(streams.action.appearance[actionId], streams.action.state[actionId]).map(merger)),
  mapContext(mapActionBehavior(props => props.actionId))
)
(ActionButton);

export function createPlugableToolbar(streamSelector, small) {
  return decoratorChain(
    connect(streams => streamSelector(streams).map(actions => ({actions}))),
    mapContext(mapActionBehavior(props => props.actionId))
  )
  (props => <ConfigurableToolbar {...props} small={small} />);
}

export const PlugableToolbarLeft = createPlugableToolbar(streams => streams.ui.toolbars.left);
export const PlugableToolbarLeftSecondary = createPlugableToolbar(streams => streams.ui.toolbars.leftSecondary);
export const PlugableToolbarRight = createPlugableToolbar(streams => streams.ui.toolbars.right, true);
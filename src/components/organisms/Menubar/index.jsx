// eslint ignore no-unused-vars
import { Divider, Stack } from '@chakra-ui/react'
import MenuButton from '@harmony/atoms/Button/Menu'

const MenuBar = ({ items, ...rest }) => (
  <Stack
    direction={'row'}
    spacing={0}
    height={20}
    align={'stretch'}
    overflowX={'scroll'}
    {...rest}
  >
    {items.flatMap(
      ({ name, icon, text, dashboard, roles, ...itemProps }, index) =>
        index
          ? [
            <Divider key={index} orientation={'vertical'} margin={0} />,
            <MenuButton key={name} to={name} icon={icon} {...itemProps}>
              {text}
            </MenuButton>,
          ]
          : [
            <MenuButton key={name} to={name} icon={icon} {...itemProps}>
              {text}
            </MenuButton>,
          ],
    )}
  </Stack>
)

export default MenuBar

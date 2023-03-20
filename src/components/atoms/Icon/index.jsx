import { Icon as ChakraIcon } from '@chakra-ui/react'
import {
  MdPerson,
  MdQrCodeScanner,
  MdTune,
  MdStar,
  MdCheckCircle,
  MdCheckCircleOutline,
  MdArrowForward,
  MdArrowBack,
  MdArrowLeft,
  MdArrowRight,
  MdArrowDropUp,
  MdArrowDropDown,
  MdSearch,
  MdInfoOutline,
  MdMoreVert,
  MdLink,
  MdAccessible,
  MdAccessibilityNew,
  MdLock,
  MdLockOpen,
  MdClose,
  MdEast,
  MdWest,
  MdPrint,
  MdCalendarToday,
  MdFavorite,
  MdThumbUp,
  MdSchedule,
  MdOutlineInsertDriveFile,
  MdOutlineDoNotDisturbOn,
} from 'react-icons/md'
import { FaChild } from 'react-icons/fa'
import { default as ElfIcon } from './Elf'
import { default as CogIcon } from './Cog'
import { default as CompassIcon } from './Compass'
import { default as ControlIcon } from './Control'
import { default as CrownIcon } from './Crown'
import { default as WoodIcon } from './Wood'

import HuskyIcon from './Husky'
import ReindeerIcon from './Reindeer'
import PassportIcon from './Passport'

const IconMap = {
  elf: ElfIcon,
  cog: CogIcon,
  compass: CompassIcon,
  control: ControlIcon,
  crown: CrownIcon,
  wood: WoodIcon,
  husky: HuskyIcon,
  reindeer: ReindeerIcon,
  passport: PassportIcon,
  MdPerson,
  MdQrCodeScanner,
  MdTune,
  MdStar,
  MdCheckCircle,
  MdCheckCircleOutline,
  MdArrowForward,
  MdArrowBack,
  MdArrowLeft,
  MdArrowRight,
  MdArrowDropUp,
  MdArrowDropDown,
  MdSearch,
  MdInfoOutline,
  MdMoreVert,
  MdLink,
  MdAccessible,
  MdAccessibilityNew,
  MdLock,
  MdLockOpen,
  MdClose,
  MdEast,
  MdWest,
  MdPrint,
  MdCalendarToday,
  MdFavorite,
  MdThumbUp,
  MdSchedule,
  MdOutlineInsertDriveFile,
  MdOutlineDoNotDisturbOn,
  FaChild,
}

const Icon = ({ name, ...rest }) => {
  const IconComponent = IconMap[name]

  if (name.startsWith('Md')) {
    return (
      <ChakraIcon
        as={IconComponent}
        height="initial"
        width="initial"
        {...rest}
      />
    )
  }

  return <IconComponent {...rest} />
}

export default Icon

export {
  ElfIcon,
  CogIcon,
  CompassIcon,
  ControlIcon,
  CrownIcon,
  WoodIcon,
  MdPerson,
  MdQrCodeScanner,
  MdTune,
  MdStar,
  MdCheckCircle,
  MdCheckCircleOutline,
  MdArrowForward,
  MdArrowBack,
  MdArrowLeft,
  MdArrowRight,
  MdArrowDropUp,
  MdArrowDropDown,
  MdSearch,
  MdInfoOutline,
  MdMoreVert,
  MdLink,
  MdAccessible,
  MdAccessibilityNew,
  MdLock,
  MdLockOpen,
  MdClose,
  MdEast,
  MdWest,
  MdPrint,
  MdCalendarToday,
  MdFavorite,
  MdThumbUp,
  MdSchedule,
  MdOutlineInsertDriveFile,
  MdOutlineDoNotDisturbOn,
  FaChild,
  HuskyIcon,
  PassportIcon,
}

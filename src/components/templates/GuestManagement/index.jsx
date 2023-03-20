import React, { useState } from 'react'

import { useNavigate } from 'react-router-dom'

import { DateTime } from 'luxon'

import {
  Heading,
  Container,
  Box,
  Flex,
  Text,
  TableContainer,
  Table,
  Tbody,
  Tr,
  Td,
  SimpleGrid,
  Button,
  Input,
  Spacer,
  Icon,
  Checkbox,
  Circle,
  HStack,
} from '@chakra-ui/react'

import {
  ArrowForwardIcon,
  ChatIcon,
  TimeIcon,
  WarningTwoIcon,
} from '@chakra-ui/icons'

import { VscFile } from 'react-icons/vsc'

import InputSelect from '@harmony/atoms/Select'
import OutlinedBadge from '@harmony/atoms/Badge/outlined'

import CheckIn from '@harmony/templates/CheckIn'

import NotesEditor, { IMPORTANT_DELIMITER } from './Notes'

import Journey, { MiscItem } from './Journey'

import parseGuests from '@harmony/libs/parseGuests'

const getThemedText = (base) => ({ children, ...rest }) => <Text {...base} {...rest}>{children}</Text>

const Action = ({
  theme = '#38D76F',
  change,
  children,
  isLoading,
}) => {
  return (
    <Button
      color={'white'}
      background={theme}
      onClick={change}
      textTransform={'uppercase'}
      padding={'0.5rem'}
      borderRadius={'0.25rem'}
      fontSize={['0.75rem', '0.75rem', '0.75rem', '0.875rem']}
      isLoading={isLoading}
    >
      {children}
    </Button>
  )
}

const tour_map = {
  huskies: 'Huskies',
  reindeers: 'Reindeers',
}

const GuestManagement = ({
  role,
  data,
  area,
  updateNotes,
  updateCustomer,
  updateOrderExtensions,
  isLoading,
}) => {
  const navigate = useNavigate()

  const [
    confirmed,
  ] = useState([])

  const {
    id,
    itemId,
    customers,
    lead_info,
    child_info,
    jingles_info,
    adult_tickets,
    child_tickets,
    infant_tickets,
    carer_tickets,
    wheelchair_tickets,
    visited,
    notes,
    booked_unit,
    vip,
    extensions,
  } = parseGuests(data)

  const ThemedText = getThemedText({
    color: area.color,
    fontSize: ['1rem', '1rem', '1rem', '1.2rem'],
    fontWeight: 'bold',
    textTransform: 'uppercase',
  })

  const StrongText = getThemedText({
    fontSize: ['1.25rem', '1.25rem', '1.25rem', '1.75rem'],
    fontWeight: 'bold',
  })

  const handleUpdateCustomer = (index) => async (payload) => {
    const state = [...customers]

    const { firstname, ...rest } = payload

    const {
      firstname: previous_name,
    } = state[index]

    if (extensions.checked_in && Array.isArray(extensions.checked_in)) {
      const checkedIndex = extensions.checked_in
        .findIndex(({ title }) => title === previous_name)

      if (checkedIndex !== -1) {
        const check_ins = [...extensions.checked_in]

        check_ins[checkedIndex].title = firstname

        await updateOrderExtensions(id, { checked_in: check_ins })
      }

    }

    state[index] = {
      ...state[index],
      firstname,
      extensions: rest,
    }

    await updateCustomer(id, state)
  }

  const handleIssueJingles = async () => {
    await updateOrderExtensions(id, { jingles_issued: true, jingles_issued_stamp: new Date().toISOString() })

    advance()
  }

  const important_notes = notes.filter((note) => note.note.startsWith(IMPORTANT_DELIMITER))

  const handleChangeTour = () => {
    const [
      hour,
      minute,
    ] = booked_unit.start_time.split(':')

    navigate(`/area/${area.id}/tours?date=${booked_unit.start_date}&time=${hour}:${minute}&order=${id}`)
  }

  const { checked_in } = extensions

  let checked = []

  if (checked_in && Array.isArray(checked_in)) {
    checked = checked_in
      .filter(item => item.type === 'tt_children_under_13')
      .map(({ title }) => title)
  }

  return (
    <>
      <Container maxW={'100%'} padding={'2rem 3rem'}>
        <Container centerContent padding={'2rem 0'}>
          <Heading as={'h2'}>{'Guest Information'}</Heading>
        </Container>
        <SimpleGrid columns={1} spacing={'2rem'}>
          {important_notes.length > 0 && (
            <Card borderRadius={'0.25rem'} padding={'1rem'}>
              <Flex
                gap={'0.25rem'}
                alignItems={'center'}
                justifyContent={'space-between'}
              >
                <Flex alignItems={'center'} gap={'0.5rem'}>
                  <WarningTwoIcon w={'1rem'} h={'1rem'} />
                  <Text noOfLines={1}>
                    {important_notes.length > 1 ? `${important_notes.length} important notes` : important_notes[0].note.replace(IMPORTANT_DELIMITER, '')}
                  </Text>
                </Flex>
                <Button
                  rightIcon={<ArrowForwardIcon />}
                  variant={'link'}
                  color={area.color}
                  as={'a'}
                  href={'#notes'}
                >
                  {'See all notes'}
                </Button>
              </Flex>
            </Card>
          )}
          <Card padding={'1rem'}>
            <HStack mr={'auto'} spacing={3}>
              {vip && <OutlinedBadge icon={'MdStar'}>{'VIP'}</OutlinedBadge>}
              {wheelchair_tickets.length > 0 && (
                <OutlinedBadge icon={'MdAccessible'}>
                  {'Wheelchair'}
                </OutlinedBadge>
              )}
            </HStack>
            <Container centerContent marginBottom={'2rem'}>
              <Text fontWeight={'bold'} fontSize={'1.75rem'}>
                {`${lead_info.lastname}, ${lead_info.firstname}`}
              </Text>
              <Flex gap={'0.25rem'} alignItems={'center'}>
                <Icon as={VscFile} w={'1.25rem'} h={'1.25rem'} />
                <Text>{`Order ref: ${id}`}</Text>
              </Flex>
            </Container>
            <Flex
              alignItems={'flex-end'}
              gap={'1rem'}
              borderBottom={'1px solid var(--chakra-colors-grey3)'}
              paddingBottom={'0.5rem'}
            >
              <ThemedText>{'Children'}</ThemedText>
              {child_info.map((child, index) => {
                return (
                  <Text fontWeight={'bold'} fontSize={'1.2rem'} key={index}>
                    {child.firstname}
                  </Text>
                )
              })}
            </Flex>
            <Flex paddingTop={'0.5rem'}>
              <Box
                flex={'1 1'}
                borderRight={'1px solid var(--chakra-colors-grey3)'}
              >
                <ThemedText>{'Show Day'}</ThemedText>
                <StrongText>
                  {DateTime.fromISO(booked_unit.start_date).toFormat('ccc dd LLL')}
                </StrongText>
              </Box>
              <Box
                flex={'1 1'}
                borderRight={'1px solid var(--chakra-colors-grey3)'}
                padding={'0 1rem'}
              >
                <ThemedText>{'Tour Time'}</ThemedText>
                <StrongText>
                  {DateTime.fromISO(booked_unit.start_time).toFormat('T')}
                </StrongText>
              </Box>
              <Box
                flex={'1 1'}
                borderRight={'1px solid var(--chakra-colors-grey3)'}
                padding={'0 1rem'}
              >
                <ThemedText>{'Tour'}</ThemedText>
                <Flex justifyContent={'space-between'} alignItems={'center'}>
                  <StrongText>
                    {extensions.group && tour_map[extensions.group] ? tour_map[extensions.group] : 'Not allocated'}
                  </StrongText>
                  {area.landing.some(({ name }) => name === 'tours') && (
                    <Action
                      theme={area.color}
                      change={handleChangeTour}
                    >
                      {'Change'}
                    </Action>
                  )}
                </Flex>
              </Box>
              <Box flex={'1 1'} paddingLeft={'1rem'}>
                <ThemedText>{'Jingles'}</ThemedText>
                <Flex justifyContent={'space-between'} alignItems={'center'}>
                  <StrongText>{jingles_info}</StrongText>
                  {!extensions.jingles_issued && (
                    <Action
                      theme={area.color}
                      change={handleIssueJingles}
                      isLoading={isLoading}
                    >
                      {'Issue'}
                    </Action>
                  )}
                </Flex>
              </Box>
            </Flex>
          </Card>
          <Card>
            <Uppercase fontWeight={'bold'} padding={'0.5rem 0 0.5rem 1.5rem'}>
              {'Order Info'}
            </Uppercase>
            <TableContainer>
              <Table variant="striped" bg={'white'}>
                <Tbody>
                  <Tr>
                    <Td textTransform={'uppercase'}>{'Lead Name'}</Td>
                    <Td fontWeight={'bold'} textTransform={'uppercase'}>
                      {`${lead_info.firstname} ${lead_info.lastname}`}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td textTransform={'uppercase'}>{'Adults'}</Td>
                    <Td fontWeight={'bold'}>{getQuantity(adult_tickets)}</Td>
                  </Tr>
                  <Tr>
                    <Td textTransform={'uppercase'}>{'Children'}</Td>
                    <Td fontWeight={'bold'}>{getQuantity(child_tickets)}</Td>
                  </Tr>
                  <Tr>
                    <Td textTransform={'uppercase'}>{'Infants'}</Td>
                    <Td fontWeight={'bold'}>{getQuantity(infant_tickets)}</Td>
                  </Tr>
                  <Tr>
                    <Td width={'14rem'} textTransform={'uppercase'}>
                      {'Personal Assistants'}
                    </Td>
                    <Td fontWeight={'bold'}>{getQuantity(carer_tickets)}</Td>
                  </Tr>
                  <Tr>
                    <Td textTransform={'uppercase'}>{'Wheelchairs'}</Td>
                    <Td fontWeight={'bold'}>
                      {getQuantity(wheelchair_tickets)}
                    </Td>
                  </Tr>
                  <Tr>
                    <Td textTransform={'uppercase'}>{'Visited Before'}</Td>
                    <Td fontWeight={'bold'}>
                      {`${visited} of ${getQuantity(child_tickets)} children`}
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>
          </Card>
          <NotesEditor
            notes={notes}
            submit={(value) => updateNotes(id, itemId, value)}
            isLoading={isLoading}
          />
          <SimpleGrid columns={[1, 1, 1, 2]} spacing={'2rem'}>
            {child_info.map((child, index) => {
              return (
                <ChildForm
                  key={index}
                  index={index}
                  child={child}
                  area={area}
                  submit={handleUpdateCustomer(child.index)}
                  allocated={checked.includes(child.firstname)}
                  isLoading={isLoading}
                />
              )
            })}
          </SimpleGrid>
          <Journey
            id={id}
            role={role}
            confirmed={confirmed}
            first={() => {
              return (
                <>
                  {extensions.jingles_issued && extensions.jingles_issued_stamp && (
                    <MiscItem
                      location={{ title: 'Jingles Issued' }}
                      scanned_at={extensions.jingles_issued_stamp}
                    />
                  )}
                </>
              )
            }}
            last={() => {
              return (
                <>
                  {extensions.tour_complete && extensions.tour_complete_stamp && (
                    <MiscItem
                      location={{ title: 'Tour Completed' }}
                      scanned_at={extensions.tour_complete_stamp}
                    />
                  )}
                </>
              )
            }}
          />
          <Box padding={'3rem 4rem 0 4rem'}>
            <Container centerContent marginBottom={'2rem'}>
              <Heading as={'h2'} id={'notes'}>
                {'Additional information'}
              </Heading>
            </Container>
            {notes.map((note, index) => {
              const important = note.note.startsWith(IMPORTANT_DELIMITER)

              return (
                <Flex
                  justifyContent={'space-between'}
                  marginBottom={'1rem'}
                  key={index}
                >
                  <Flex gap={'0.5rem'} flexGrow={'0'}>
                    <Circle
                      width={'2.75rem'}
                      height={'2.75rem'}
                      color={'white'}
                      bg={'brand.woodland'}
                      marginBottom={'1rem'}
                    >
                      <ChatIcon w={'1rem'} h={'1rem'} />
                    </Circle>
                    <Box>
                      <Flex alignItems={'center'} gap={'0.5rem'}>
                        {important && (
                          <WarningTwoIcon w={'1rem'} h={'1rem'} />
                        )}
                        <Text fontWeight={'bold'} fontSize={'1.25rem'}>{'Note'}</Text>
                      </Flex>
                      <Text>{'by '}<Text as={'span'} color={'brand.woodland'}>{note.user}</Text>
                      </Text>
                      <Text marginTop={'1rem'}>
                        {note.note.replace(IMPORTANT_DELIMITER, '')}
                      </Text>
                    </Box>
                  </Flex>
                  <Box>
                    <Flex color={'grey2'} alignItems={'center'} gap={'0.5rem'}>
                      <TimeIcon />
                      <Text>
                        {`${DateTime.fromISO(note.timestamp).toFormat('ccc dd LLL')} at ${DateTime.fromISO(note.timestamp).toFormat('T')}`}
                      </Text>
                    </Flex>
                  </Box>
                </Flex>
              )
            })}
          </Box>
          <NotesEditor
            notes={notes}
            submit={(value) => updateNotes(id, itemId, value)}
            isLoading={isLoading}
          />
        </SimpleGrid>
      </Container>
      <CheckIn
        id={id}
        area={area}
        position={'sticky'}
        bottom={'0'}
        confirmed={confirmed}
        allocated={extensions.group && tour_map[extensions.group]}
        group={extensions.group}
      />
    </>
  )
}

const getQuantity = (tickets) => tickets.reduce((acc, cur) => acc + cur.qty, 0)

const Card = ({ borderRadius = '1rem', children, ...rest }) => (
  <Box
    bg={'white'}
    borderRadius={borderRadius}
    boxShadow={'base'}
    overflow={'hidden'}
    {...rest}
  >
    {children}
  </Box>
)

const Uppercase = ({ children, ...rest }) => (
  <Text textTransform={'uppercase'} {...rest}>
    {children}
  </Text>
)

const getChildInfo = (child) => {
  return {
    firstname: child.firstname,
    lastname: child.lastname || '',
    name_pronunciation: child.extensions.name_pronunciation || '',
    gender: child.extensions.gender || '',
    relationship: child.extensions.relationship || '',
    age: child.extensions.age || '',
    favourite_thing: child.extensions.favourite_thing || '',
    favourite_thing_relationship: child.extensions.favourite_thing_relationship || '',
    favourite_activity: child.extensions.favourite_activity || '',
    memorable_event: child.extensions.memorable_event || '',
    attendance: child.extensions.attendance || [],
    visited: !!(child.extensions.attendance && child.extensions.attendance.length) || child.extensions.visited || false,
  }
}

const ageOptions = [
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
  { label: '6', value: '6' },
  { label: '7', value: '7' },
  { label: '8', value: '8' },
  { label: '9', value: '9' },
  { label: '10', value: '10' },
  { label: '11', value: '11' },
  { label: '12', value: '12' },
  { label: '13', value: '13' },
  { label: '14', value: '14' },
  { label: '15', value: '15' },
  { label: '16', value: '16' },
  { label: 'Other', value: 'other' },
]

const genderOptions = [
  { label: 'Boy', value: 'boy' },
  { label: 'Girl', value: 'girl' },
  { label: 'Rather not say', value: 'other' },
]

const ChildForm = ({
  index,
  child,
  area,
  submit,
  isLoading,
  allocated,
}) => {
  const [editing, setEditing] = useState(false)

  const [state, setState] = useState(getChildInfo(child))

  const handleToggleEdit = async () => {
    if (editing) {
      await handleSubmit(state)
    }

    setState(getChildInfo(child))

    setEditing(!editing)
  }

  const handleChange = (field) => (value) => {
    const current = { ...state }

    current[field] = value

    setState(current)
  }

  const handleSubmit = () => {
    const { lastname, ...rest } = state

    submit(rest)
  }

  const details = editing ? state : getChildInfo(child)

  return (
    <Card>
      <Flex padding={'1rem'}>
        <Box>
          <Text textTransform={'uppercase'}>{`Child ${index + 1}${!allocated ? ' (Not attending)' : ''}`}</Text>
          <Text fontWeight={'bold'} fontSize={'1.5rem'}>
            {details.firstname}
          </Text>
        </Box>
        <Spacer />
        <Action
          theme={area.color}
          change={handleToggleEdit}
          isLoading={isLoading}
        >
          {editing ? 'Save' : 'Edit Info'}
        </Action>
      </Flex>
      <TableContainer>
        <Table variant={'striped'} bg={'white'}>
          <Tbody>
            <EditableRow
              label={'Full name'}
              value={details.firstname}
              change={handleChange('firstname')}
              editable={editing}
            />
            <EditableRow
              label={'Pronunciation'}
              value={details.name_pronunciation}
              change={handleChange('name_pronunciation')}
              editable={editing}
            />
            <EditableRow
              label={'Age'}
              value={details.age}
              change={handleChange('age')}
              editable={editing}
              type={'select'}
              options={ageOptions}
            />
            <EditableRow
              label={'Gender'}
              value={details.gender}
              change={handleChange('gender')}
              editable={editing}
              type={'select'}
              options={genderOptions}
            />
            <EditableRow
              label={'Returning Visitor'}
              value={details.visited}
              change={handleChange('visited')}
              editable={editing}
              type={'check'}
            />
            <EditableRow
              label={'Favourite Thing'}
              value={details.favourite_thing}
              change={handleChange('favourite_thing')}
              editable={editing}
            />
            <EditableRow
              label={'Type'}
              value={details.favourite_thing_relationship}
              change={handleChange('favourite_thing_relationship')}
              editable={editing}
            />
            <EditableRow
              label={'Hobby'}
              value={details.favourite_activity}
              change={handleChange('favourite_activity')}
              editable={editing}
            />
            <EditableRow
              label={'Recent Event'}
              value={details.memorable_event}
              change={handleChange('memorable_event')}
              editable={editing}
            />
          </Tbody>
        </Table>
      </TableContainer>
    </Card>
  )
}

const EditableRow = ({
  label,
  value,
  change,
  editable = false,
  type = 'text',
  options = [],
}) => {
  let Component = InputText

  if (type === 'select') Component = InputSelect
  if (type === 'check') Component = InputCheck

  return (
    <Tr>
      <Td textTransform={'uppercase'} width={'14rem'}>
        {label}
      </Td>
      {!editable && (
        <Td fontWeight={'bold'}>
          {type === 'check' ? (value ? 'Yes' : 'No') : value}
        </Td>
      )}
      {editable && (
        <Td>
          <Component
            value={value}
            placeholder={label}
            change={change}
            options={options}
          />
        </Td>
      )}
    </Tr>
  )
}

const InputText = ({ value, placeholder, change }) => {
  const handleChange = (event) => {
    change(event.target.value)
  }

  return (
    <Input
      value={value}
      placeholder={placeholder}
      onChange={handleChange}
      type={'text'}
      bg={'white'}
    />
  )
}

const InputCheck = ({ value, placeholder, change }) => {
  const handleChange = () => {
    change(!value)
  }

  return (
    <Checkbox onChange={handleChange} isChecked={value}>
      {placeholder}
    </Checkbox>
  )
}

export default GuestManagement

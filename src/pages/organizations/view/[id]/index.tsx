import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import React, { useState } from 'react';
import {
  Text,
  Box,
  Spinner,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Button,
  Link,
  IconButton,
  Flex,
  Center,
  Stack,
} from '@chakra-ui/react';
import { UserSelect } from 'components/user-select';
import { FiTrash, FiEdit2, FiEdit3 } from 'react-icons/fi';
import { getOrganizationById } from 'apiSdk/organizations';
import { Error } from 'components/error';
import { OrganizationInterface } from 'interfaces/organization';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';
import { deleteThreadById } from 'apiSdk/threads';
import { deleteMemberById, createMember } from 'apiSdk/members';

function OrganizationViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<OrganizationInterface>(
    () => (id ? `/organizations/${id}` : null),
    () =>
      getOrganizationById(id, {
        relations: ['user', 'thread', 'member'],
      }),
  );

  const threadHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteThreadById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const [memberUserId, setMemberUserId] = useState(null);
  const memberHandleCreate = async () => {
    setCreateError(null);
    try {
      await createMember({ organization_id: id, user_id: memberUserId });
      setMemberUserId(null);
      await mutate();
    } catch (error) {
      setCreateError(error);
    }
  };
  const memberHandleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteMemberById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const [deleteError, setDeleteError] = useState(null);
  const [createError, setCreateError] = useState(null);

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Flex justifyContent="space-between" mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Organization Detail View
          </Text>
          {hasAccess('organization', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
            <NextLink href={`/organizations/edit/${data?.id}`} passHref legacyBehavior>
              <Button
                onClick={(e) => e.stopPropagation()}
                mr={2}
                as="a"
                variant="outline"
                colorScheme="blue"
                leftIcon={<FiEdit2 />}
              >
                Edit
              </Button>
            </NextLink>
          )}
        </Flex>
        {error && (
          <Box mb={4}>
            {' '}
            <Error error={error} />{' '}
          </Box>
        )}
        {isLoading ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <>
            <Stack direction="column" spacing={2} mb={4}>
              <Flex alignItems="center">
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Description:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  {data?.description}
                </Text>
              </Flex>
              <Flex alignItems="center">
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Image:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  {data?.image}
                </Text>
              </Flex>
              <Flex alignItems="center">
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Name:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  {data?.name}
                </Text>
              </Flex>
              <Flex alignItems="center">
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Created At:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  {data?.created_at as unknown as string}
                </Text>
              </Flex>
              <Flex alignItems="center">
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Updated At:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  {data?.updated_at as unknown as string}
                </Text>
              </Flex>
            </Stack>
            <Box>
              {hasAccess('user', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                <Flex alignItems="center" mb={4}>
                  <Text fontSize="lg" fontWeight="bold" as="span">
                    User:
                  </Text>
                  <Text fontSize="md" as="span" ml={3}>
                    <Link as={NextLink} href={`/users/view/${data?.user?.id}`}>
                      {data?.user?.email}
                    </Link>
                  </Text>
                </Flex>
              )}
              {hasAccess('thread', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                <Stack spacing={2} mb={8}>
                  <Flex justifyContent="space-between">
                    <Text fontSize="lg" fontWeight="bold">
                      Threads
                    </Text>
                    <NextLink passHref href={`/threads/create?organization_id=${data?.id}`}>
                      <Button colorScheme="blue" mr="4" as="a">
                        Create
                      </Button>
                    </NextLink>
                  </Flex>
                  <TableContainer mb={4}>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>title</Th>
                          <Th>Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {data?.thread?.map((record) => (
                          <Tr
                            cursor="pointer"
                            onClick={() => router.push(`/threads/view/${record.id}`)}
                            key={record.id}
                          >
                            <Td>{record.title}</Td>
                            <Td>
                              {hasAccess('thread', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                                <NextLink
                                  onClick={(e) => e.stopPropagation()}
                                  passHref
                                  href={`/threads/edit/${record.id}`}
                                >
                                  <Button mr={2} as="a" variant="outline" colorScheme="blue" leftIcon={<FiEdit2 />}>
                                    Edit
                                  </Button>
                                </NextLink>
                              )}
                              {hasAccess('thread', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
                                <IconButton
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    threadHandleDelete(record.id);
                                  }}
                                  colorScheme="red"
                                  variant="outline"
                                  aria-label="edit"
                                  icon={<FiTrash />}
                                />
                              )}
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </Stack>
              )}
            </Box>
            <Box>
              <Stack spacing={2} mb={8}>
                <Text fontSize="lg" fontWeight="bold">
                  Members:
                </Text>
                <Flex gap={5} alignItems="flex-end">
                  <Box flex={1}>
                    <UserSelect name={'member_user'} value={memberUserId} handleChange={setMemberUserId} />
                  </Box>
                  <Button colorScheme="blue" mt="4" mr="4" onClick={memberHandleCreate} isDisabled={!memberUserId}>
                    Create
                  </Button>
                </Flex>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Email</Th>

                        <Th>Actions</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {data?.member?.map((record) => (
                        <Tr
                          cursor="pointer"
                          onClick={() => router.push(`/users/view/${record?.user?.id}`)}
                          key={record?.user?.id}
                        >
                          <Td>{record?.user?.email}</Td>

                          <Td>
                            {hasAccess('user', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  memberHandleDelete(record.id);
                                }}
                                colorScheme="red"
                                variant="outline"
                                aria-label="edit"
                                icon={<FiTrash />}
                              />
                            )}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </Stack>
            </Box>
          </>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'organization',
  operation: AccessOperationEnum.READ,
})(OrganizationViewPage);

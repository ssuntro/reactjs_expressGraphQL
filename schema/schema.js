const graphql = require('graphql')
// const _ = require('lodash')
const axios = require('axios').default

const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema } = graphql

const users = [
  { id: '11', firstName: 'Bill', age: 20 },
  { id: '22', firstName: 'Anne', age: 29 },
]

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
  },
})

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    userJa: {
      //
      type: UserType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        // return _.find(users, { id: args.id })
        //can return raw json or js obj

        return axios
          .get(`http://localhost:3000/users/${args.id}`)
          .then((resp) => resp.data)
      },
    },
  },
})

module.exports = new GraphQLSchema({ query: RootQuery })

//graphQL = 50% query + 50% schema

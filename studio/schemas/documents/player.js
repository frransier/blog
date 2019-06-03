export default {
  name: 'player',
  type: 'document',
  title: 'Players',
  fields: [
    {
      name: 'name',
      type: 'string',
      title: 'Name'
    },
    {
      name: 'team',
      type: 'string',
      title: 'Team'
    },
    {
      name: 'included',
      type: 'boolean',
      title: 'Included'
    },
    {
      name: 'ppg',
      type: 'number',
      title: 'Points per game'
    }
  ]
}

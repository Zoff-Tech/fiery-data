
/// <reference path="../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../node_modules/@types/chai-as-promised/index.d.ts" />

import $getFiery, { define, setGlobalOptions } from '../src'
import { FieryChanges, FieryOptionsInput } from '../src/types'
import { globalOptions } from '../src/options'
import { getStore, getStored } from './util'
import * as chai from 'chai'
import * as chaiAsPromised from 'chai-as-promised'

const expect = chai.expect;

chai.use(chaiAsPromised)

describe('operations', function()
{

  before(function() {
    globalOptions.user = undefined
    globalOptions.defined = {}

    setGlobalOptions({
      record: true
    })

    define({
      todo: {
        include: ['name', 'done', 'due', 'assigned_to'],
        defaults: {
          name: '',
          done: false,
          due: null,
          assigned_to: null
        },
        sub: {
          children: 'todo'
        }
      }
    })
  })

  it ('updates', function()
  {
    const fs = getStore('operations updates', {
      'todos/1': { name: 'T1', done: false },
      'todos/2': { name: 'T2', done: true }
    })

    const $fiery = $getFiery()
    const todos: any = $fiery(fs.collection('todos'), 'todo')

    const todo1 = todos[0]

    expect(todo1).to.be.ok
    expect(todo1.name).to.equal('T1')

    todo1.name = 'T1a'
    todo1.$update()

    expect(getStored(fs, todo1).name).to.equal('T1a')

    $fiery.destroy()
  })

  it ('syncs', function()
  {
    const fs = getStore('operations syncs', {
      'todos/1': { name: 'T1', done: false },
      'todos/2': { name: 'T2', done: true }
    })

    const $fiery = $getFiery()
    const todo1: any = $fiery(fs.doc('todos/1'), 'todo')

    expect(todo1).to.be.ok
    expect(todo1.name).to.equal('T1')

    delete todo1.name
    todo1.$sync()

    expect(getStored(fs, todo1).done).to.equal(false)
    expect(getStored(fs, todo1).name).to.undefined

    $fiery.destroy()
  })

  it ('removes', function()
  {
    const fs = getStore('operations removes', {
      'todos/1': { name: 'T1', done: false },
      'todos/2': { name: 'T2', done: true }
    })

    const $fiery = $getFiery()
    const todo1: any = $fiery(fs.doc('todos/1'), 'todo')

    expect(todo1).to.be.ok
    expect(todo1.name).to.equal('T1')

    todo1.$remove()

    expect(getStored(fs, todo1)).to.be.undefined

    $fiery.destroy()
  })

  it ('removes subs', function()
  {
    const fs = getStore('operations removes subs', {
      'todos/1': { name: 'T1', done: false },
      'todos/1/children/1': { name: 'T2', done: true }
    })

    const $fiery = $getFiery()
    const todo1: any = $fiery(fs.doc('todos/1'), 'todo')

    expect(todo1).to.be.ok
    expect(todo1.name).to.equal('T1')
    expect(todo1.children.length).to.equal(1)
    expect(todo1.children[0].name).to.equal('T2')

    const todo2: any = todo1.children[0]

    expect(getStored(fs, todo1)).to.be.ok
    expect(getStored(fs, todo2)).to.be.ok

    todo1.$remove()

    expect(getStored(fs, todo1)).to.be.undefined
    expect(getStored(fs, todo2)).to.be.undefined

    $fiery.destroy()
  })

  it ('clears', function()
  {
    const fs = getStore('operations clears', {
      'todos/1': { name: 'T1', done: false },
      'todos/1/children/1': { name: 'T2', done: true }
    })

    const $fiery = $getFiery()
    const todo1: any = $fiery(fs.doc('todos/1'), 'todo')

    expect(todo1).to.be.ok
    expect(todo1.name).to.equal('T1')
    expect(todo1.children.length).to.equal(1)
    expect(todo1.children[0].name).to.equal('T2')

    const todo2: any = todo1.children[0]

    expect(getStored(fs, todo1)).to.be.ok
    expect(getStored(fs, todo2)).to.be.ok

    todo1.$clear(['name', 'children'])

    expect(getStored(fs, todo1)).to.be.ok
    expect(getStored(fs, todo1).name).to.be.undefined
    expect(getStored(fs, todo2)).to.be.undefined
    expect(todo1.children.length).to.equal(0)

    $fiery.destroy()
  })

  it ('getChanges', function(done)
  {
    const fs = getStore('operations getChange', {
      'todos/1': { name: 'T1', done: false },
      'todos/1/children/1': { name: 'T2', done: true }
    })

    const $fiery = $getFiery()
    const todo1: any = $fiery(fs.doc('todos/1'), 'todo')

    expect(todo1).to.be.ok
    expect(todo1.name).to.equal('T1')

    todo1.name = 'T1a'
    todo1.$getChanges().then((changes: FieryChanges) => {

      expect(changes.changed).to.be.true
      expect(changes.remote).to.deep.equal({name: 'T1'})
      expect(changes.local).to.deep.equal({name: 'T1a'})

      $fiery.destroy()

      done()
    })
  })

  it ('getChanges none', function(done)
  {
    const fs = getStore('operations getChange none', {
      'todos/1': { name: 'T1', done: false },
      'todos/1/children/1': { name: 'T2', done: true }
    })

    const $fiery = $getFiery()
    const todo1: any = $fiery(fs.doc('todos/1'), 'todo')

    expect(todo1).to.be.ok
    expect(todo1.name).to.equal('T1')

    todo1.name = 'T1'
    todo1.$getChanges().then((changes: FieryChanges) => {

      expect(changes.changed).to.be.false
      expect(changes.remote).to.deep.equal({})
      expect(changes.local).to.deep.equal({})

      $fiery.destroy()

      done()
    })
  })

  it ('getChanges specific', function(done)
  {
    const fs = getStore('operations getChange specific', {
      'todos/1': { name: 'T1', done: false },
      'todos/1/children/1': { name: 'T2', done: true }
    })

    const $fiery = $getFiery()
    const todo1: any = $fiery(fs.doc('todos/1'), 'todo')

    expect(todo1).to.be.ok
    expect(todo1.name).to.equal('T1')
    expect(todo1.done).to.be.false

    todo1.name = 'T1a'
    todo1.done = true

    todo1.$getChanges(['name']).then((changes: FieryChanges) => {

      expect(changes.changed).to.be.true
      expect(changes.remote).to.deep.equal({name: 'T1'})
      expect(changes.local).to.deep.equal({name: 'T1a'})

      todo1.$getChanges('done').then((changes: FieryChanges) => {

        expect(changes.changed).to.be.true
        expect(changes.remote).to.deep.equal({done: false})
        expect(changes.local).to.deep.equal({done: true})

        todo1.$getChanges([]).then((changes: FieryChanges) => {

          expect(changes.changed).to.be.false

          $fiery.destroy()

          done()
        })
      })
    })
  })

  it('build', function() {
    const fs = getStore('operations build', {
      'todos/1': { name: 'T1', done: false },
      'todos/2': { name: 'T2', done: true }
    })

    const $fiery = $getFiery()

    const todos: any = $fiery(fs.collection('todos'), 'todo', 'todos')

    const todo3: any = $fiery.build('todos')

    expect(todo3).to.be.ok
    expect(todo3.name).to.equal('')
    expect(todo3.done).to.be.false
    expect(todo3.due).to.be.null
    expect(todo3.assigned_to).to.be.null

    expect(todos.length).to.equal(2)
    expect(getStored(fs, todo3)).to.be.undefined

    $fiery.destroy()
  })

  it('build initial', function() {
    const fs = getStore('operations build initial', {
      'todos/1': { name: 'T1', done: false },
      'todos/2': { name: 'T2', done: true }
    })

    const $fiery = $getFiery()

    const todos: any = $fiery(fs.collection('todos'), 'todo', 'todos')

    const todo3: any = $fiery.build('todos', {
      name: 'T3',
      due: new Date()
    })

    expect(todo3).to.be.ok
    expect(todo3.name).to.equal('T3')
    expect(todo3.done).to.be.false
    expect(todo3.due).to.be.ok
    expect(todo3.assigned_to).to.be.null

    expect(todos.length).to.equal(2)
    expect(getStored(fs, todo3)).to.be.undefined

    $fiery.destroy()
  })

  it('create', function() {
    const fs = getStore('operations create', {
      'todos/1': { name: 'T1', done: false },
      'todos/2': { name: 'T2', done: true }
    })

    const $fiery = $getFiery()

    const todos: any = $fiery(fs.collection('todos'), 'todo', 'todos')

    const todo3: any = $fiery.create('todos')

    expect(todo3).to.be.ok
    expect(todo3.name).to.equal('')
    expect(todo3.done).to.be.false
    expect(todo3.due).to.be.null
    expect(todo3.assigned_to).to.be.null

    expect(todos.length).to.equal(3)
    expect(getStored(fs, todo3)).to.be.ok
    expect(todos[2]).to.equal(todo3)

    $fiery.destroy()
  })

  it('create initial', function() {
    const fs = getStore('operations create initial', {
      'todos/1': { name: 'T1', done: false },
      'todos/2': { name: 'T2', done: true }
    })

    const $fiery = $getFiery()

    const todos: any = $fiery(fs.collection('todos'), 'todo', 'todos')

    const todo3: any = $fiery.create('todos', {
      name: 'T3',
      due: new Date()
    })

    expect(todo3).to.be.ok
    expect(todo3.name).to.equal('T3')
    expect(todo3.done).to.be.false
    expect(todo3.due).to.be.ok
    expect(todo3.assigned_to).to.be.null

    expect(todos.length).to.equal(3)
    expect(getStored(fs, todo3)).to.be.ok
    expect(todos[2]).to.equal(todo3)

    $fiery.destroy()
  })

  it('build sub', function() {
    const fs = getStore('operations build sub', {
      'todos/1': { name: 'T1', done: false },
      'todos/2': { name: 'T2', done: true }
    })

    const $fiery = $getFiery()

    const todos: any = $fiery(fs.collection('todos'), 'todo', 'todos')
    const todo1: any = todos[0]
    const todo3: any = todo1.$build('children')

    expect(todo3).to.be.ok
    expect(todo3.name).to.equal('')
    expect(todo3.done).to.be.false
    expect(todo3.due).to.be.null
    expect(todo3.assigned_to).to.be.null

    expect(todos.length).to.equal(2)
    expect(todo1.children.length).to.equal(0)
    expect(getStored(fs, todo3)).to.be.undefined

    $fiery.destroy()
  })

  it('build sub initial', function() {
    const fs = getStore('operations build sub initial', {
      'todos/1': { name: 'T1', done: false },
      'todos/2': { name: 'T2', done: true }
    })

    const $fiery = $getFiery()

    const todos: any = $fiery(fs.collection('todos'), 'todo', 'todos')

    const todo1: any = todos[0]
    const todo3: any = todo1.$build('children', {
      name: 'T3',
      due: new Date()
    })

    expect(todo3).to.be.ok
    expect(todo3.name).to.equal('T3')
    expect(todo3.done).to.be.false
    expect(todo3.due).to.be.ok
    expect(todo3.assigned_to).to.be.null

    expect(todos.length).to.equal(2)
    expect(todo1.children.length).to.equal(0)
    expect(getStored(fs, todo3)).to.be.undefined

    $fiery.destroy()
  })

  it('create sub', function() {
    const fs = getStore('operations create sub', {
      'todos/1': { name: 'T1', done: false },
      'todos/2': { name: 'T2', done: true }
    })

    const $fiery = $getFiery()

    const todos: any = $fiery(fs.collection('todos'), 'todo', 'todos')

    const todo1: any = todos[0]
    const todo3: any = todo1.$create('children')

    expect(todo3).to.be.ok
    expect(todo3.name).to.equal('')
    expect(todo3.done).to.be.false
    expect(todo3.due).to.be.null
    expect(todo3.assigned_to).to.be.null

    expect(todos.length).to.equal(2)
    expect(todo1.children.length).to.equal(1)
    expect(getStored(fs, todo3)).to.be.ok
    expect(todo1.children[0]).to.equal(todo3)

    $fiery.destroy()
  })

  it('create sub initial', function() {
    const fs = getStore('operations create sub initial', {
      'todos/1': { name: 'T1', done: false },
      'todos/2': { name: 'T2', done: true }
    })

    const $fiery = $getFiery()

    const todos: any = $fiery(fs.collection('todos'), 'todo', 'todos')

    const todo1: any = todos[0]
    const todo3: any = todo1.$create('children', {
      name: 'T3',
      due: new Date()
    })

    expect(todo3).to.be.ok
    expect(todo3.name).to.equal('T3')
    expect(todo3.done).to.be.false
    expect(todo3.due).to.be.ok
    expect(todo3.assigned_to).to.be.null

    expect(todos.length).to.equal(2)
    expect(todo1.children.length).to.equal(1)
    expect(getStored(fs, todo3)).to.be.ok
    expect(todo1.children[0]).to.equal(todo3)

    $fiery.destroy()
  })

  it('refreshes', function(done) {

    const fs = getStore('operations refreshes', {
      'todos/1': { name: 'T1', order: 1 }
    })

    const $fiery = $getFiery()

    const todo: any = $fiery(fs.doc('todos/1'))

    todo.name = 'T2'

    $fiery.refresh(todo)
      .then(() =>
      {
        expect(todo.name).to.equal('T1')

        $fiery.destroy()

        done()
      })
  })

  it('pager', function() {

    const fs = getStore('operations pager', {
      'todos/1': { name: 'T1', order: 1 },
      'todos/2': { name: 'T2', order: 2 },
      'todos/3': { name: 'T3', order: 3 },
      'todos/4': { name: 'T4', order: 4 },
      'todos/5': { name: 'T5', order: 5 },
      'todos/6': { name: 'T6', order: 6 },
      'todos/7': { name: 'T7', order: 7 },
      'todos/8': { name: 'T8', order: 8 },
      'todos/9': { name: 'T9', order: 9 }
    })

    const $fiery = $getFiery()

    const options: FieryOptionsInput = {
      extends: 'todo',
      query: q => q.orderBy('order').limit(5)
    }

    const todos: any[] = $fiery(fs.collection('todos'), options, 'todos')

    expect(todos).to.be.ok
    expect(todos.length).to.equal(5)
    expect(todos.map(t => t.name)).to.deep.equal(['T1', 'T2', 'T3', 'T4', 'T5'])

    const pager = $fiery.pager(todos)

    expect(pager).to.be.ok

    if (pager)
    {
      expect(pager.hasNext()).to.be.true
      expect(pager.hasPrev()).to.be.false
      expect(pager.index).to.equal(0)

      expect(pager.next()).to.eventually.be.fulfilled

      expect(todos.length).to.equal(4)
      expect(todos.map(t => t.name)).to.deep.equal(['T6', 'T7', 'T8', 'T9'])
      expect(pager.hasNext()).to.be.true
      expect(pager.hasPrev()).to.be.true
      expect(pager.index).to.equal(1)

      expect(pager.next()).to.eventually.be.fulfilled

      expect(todos.length).to.equal(0)
      expect(pager.hasNext()).to.be.false

      expect(pager.prev()).to.eventually.be.fulfilled

      expect(todos.length).to.equal(4)
      expect(todos.map(t => t.name)).to.deep.equal(['T6', 'T7', 'T8', 'T9'])
      expect(pager.hasNext()).to.be.true
      expect(pager.hasPrev()).to.be.true
      expect(pager.index).to.equal(1)

      expect(pager.prev()).to.eventually.be.fulfilled

      expect(todos.length).to.equal(5)
      expect(todos.map(t => t.name)).to.deep.equal(['T1', 'T2', 'T3', 'T4', 'T5'])
      expect(pager.hasNext()).to.be.true
      expect(pager.hasPrev()).to.be.false
      expect(pager.index).to.equal(0)

      expect(pager.prev()).to.eventually.be.rejected

      expect(todos.length).to.equal(5)
      expect(todos.map(t => t.name)).to.deep.equal(['T1', 'T2', 'T3', 'T4', 'T5'])
      expect(pager.hasNext()).to.be.true
      expect(pager.hasPrev()).to.be.false
      expect(pager.index).to.equal(0)
    }

  })

  // https://github.com/fiery-data/fiery-vue/issues/6
  it('pager (#6)', function(done) {

    const fs = getStore('operations pager (#6)', {
      'todos/1': { name: 'T1', order: 1 },
      'todos/2': { name: 'T2', order: 2 },
      'todos/3': { name: 'T3', order: 3 },
      'todos/4': { name: 'T4', order: 4 },
      'todos/5': { name: 'T5', order: 5 },
      'todos/6': { name: 'T6', order: 6 },
      'todos/7': { name: 'T7', order: 7 },
      'todos/8': { name: 'T8', order: 8 },
      'todos/9': { name: 'T9', order: 9 }
    })

    const $fiery = $getFiery()

    const options: FieryOptionsInput = {
      extends: 'todo',
      query: q => q.orderBy('order').limit(1),
      queryReverse: q => q.orderBy('order', 'desc').limit(1)
    }

    const todos: any[] = $fiery(fs.collection('todos'), options, 'todos')

    expect(todos).to.be.ok
    expect(todos.length).to.equal(1)
    expect(todos.map(t => t.name)).to.deep.equal(['T1'])

    const pager = $fiery.pager(todos)

    expect(pager).to.be.ok

    if (pager)
    {
      expect(pager.hasNext()).to.be.true
      expect(pager.hasPrev()).to.be.false
      expect(pager.index).to.equal(0)

      expect(pager.next()).to.eventually.be.fulfilled

      expect(todos.length).to.equal(1)
      expect(todos.map(t => t.name)).to.deep.equal(['T2'])
      expect(pager.hasNext()).to.be.true
      expect(pager.hasPrev()).to.be.true
      expect(pager.index).to.equal(1)

      expect(pager.next()).to.eventually.be.fulfilled

      expect(todos.length).to.equal(1)
      expect(todos.map(t => t.name)).to.deep.equal(['T3'])
      expect(pager.hasNext()).to.be.true
      expect(pager.hasPrev()).to.be.true
      expect(pager.index).to.equal(2)

      pager.prev().then(
        () => {
          expect(todos.length).to.equal(1)
          expect(todos.map(t => t.name)).to.deep.equal(['T2'])
          expect(pager.hasNext()).to.be.true
          expect(pager.hasPrev()).to.be.true
          expect(pager.index).to.equal(1)

          pager.prev().then(
            () => {
              expect(todos.length).to.equal(1)
              expect(todos.map(t => t.name)).to.deep.equal(['T1'])
              expect(pager.hasNext()).to.be.true
              expect(pager.hasPrev()).to.be.false
              expect(pager.index).to.equal(0)

              done();
            },
            () => {
              throw 'Unexpected failure.'
            }
          )
        },
        () => {
          throw 'Unexpected failure.'
        }
      )
    }

  })

})

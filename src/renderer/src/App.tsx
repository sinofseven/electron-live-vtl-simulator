import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { faSun } from '@fortawesome/free-regular-svg-icons'
import { faMoon } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { ChangeEvent, JSX, useEffect, useState } from 'react'

import Styles from './App.module.css'
import { DEFAULT_TEXT_DATA, DEFAULT_TEXT_TEMPLATE } from './default_values'

function App(): JSX.Element {
  const [isDarkMode, setIsDarkMode] = useState(detectPrefersDarkMode())
  const [isData, setIsData] = useState(false)
  const [textData, setTextData] = useState(DEFAULT_TEXT_DATA)
  const [textTemplate, setTextTemplate] = useState(DEFAULT_TEXT_TEMPLATE)
  const [textOutput, setTextOutput] = useState('')
  const [textTab, setTextTab] = useState('Result')
  const [isError, setIsError] = useState(false)

  const textInput = isData ? textData : textTemplate

  function updateTextInput(e: ChangeEvent<HTMLTextAreaElement>): void {
    const text = e.target.value
    if (isData) {
      setTextData(text)
    } else {
      setTextTemplate(text)
    }
  }

  async function updateRenderResult(): Promise<void> {
    let data: object = {}
    try {
      data = JSON.parse(textData)
    } catch (e) {
      setIsError(true)
      setTextOutput((e as Error).stack!)
      setTextTab('JSON Parse Error')
      return
    }

    try {
      const output = await window.api.renderByVelocity({
        text: textTemplate,
        data
      })
      setIsError(output.isError)
      setTextOutput(output.text)
      setTextTab('Result')
    } catch (e) {
      setIsError(true)
      setTextOutput((e as Error).stack!)
      setTextTab('Template Render Error')
    }
  }

  updateDarkMode(isDarkMode)

  useEffect(() => {
    updateRenderResult()
  }, [isError, textOutput, textTab, textInput])

  return (
    <>
      <nav className="navbar is-info">
        <div className="navbar-brand">
          <h2 className="navbar-item title">Live VTL Simulator</h2>
        </div>
        <div className="navbar-end">
          <div className="navbar-item">
            <span
              className={classNames(Styles.CursorPointer, Styles.NavbarIcon, 'icon', 'mr-5')}
              onClick={() => setIsDarkMode(!isDarkMode)}
            >
              <FontAwesomeIcon icon={isDarkMode ? faMoon : faSun} />
            </span>
            <a
              href="https://github.com/sinofseven/electron-live-vtl-simulator"
              target="_blank"
              rel="noreferrer noopener"
              className={classNames(Styles.NavbarIcon, 'icon', 'has-text-black')}
            >
              <FontAwesomeIcon icon={faGithub} />
            </a>
          </div>
        </div>
      </nav>
      <div className="container is-fullhd pt-5">
        <div className="columns">
          <div className="column">
            <div className="tabs">
              <ul>
                <li className={classNames({ 'is-active': isData })}>
                  <a onClick={() => setIsData(true)}>Data</a>
                </li>
                <li className={classNames({ 'is-active': !isData })}>
                  <a onClick={() => setIsData(false)}>Template</a>
                </li>
              </ul>
            </div>
            <textarea
              className={classNames('textarea', Styles.Editor)}
              value={textInput}
              onChange={updateTextInput}
            />
          </div>
          <div className="column">
            <div className="tabs">
              <ul>
                <li className="is-active">
                  <a>{textTab}</a>
                </li>
              </ul>
            </div>
            <textarea
              className={classNames('textarea', Styles.Editor, { 'is-danger': isError })}
              readOnly
              value={textOutput}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default App

function detectPrefersDarkMode(): boolean {
  const match = window.matchMedia('(prefers-color-scheme: dark)')
  return match.matches
}

function updateDarkMode(isDarkMode: boolean): void {
  const elm = document.getElementsByTagName('html')[0]
  elm.setAttribute('data-theme', isDarkMode ? 'dark' : 'light')
}

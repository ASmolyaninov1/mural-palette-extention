import React, { useContext } from 'react'
import { Radio } from "elements"
import { UserContext } from 'contexts'

import './PaletteAccessRadio.css'

const PaletteAccessRadio = ({ access, onChange }) => {
  const user = useContext(UserContext)
  if (!user) return null

  const userMuralCompany = user.muralCompany
  return (
    <div>
      <div className={'palette-access-title'}>
        Who can use this palette?
      </div>
      <div className={'palette-access-action'}>
        <Radio
          label={'Only me'}
          checked={access === 'me'}
          onChange={() => onChange('me')}
        />
      </div>
      <div className={'palette-access-action'}>
        <Radio
          label={'Members of workspace'}
          checked={access === 'workspace'}
          onChange={() => onChange('workspace')}
        />
      </div>
      {!!userMuralCompany && (
        <div className={'palette-access-action'}>
          <Radio
            label={'Members of company'}
            checked={access === 'company'}
            onChange={() => onChange('company')}
          />
        </div>
      )}
    </div>
  )
}

export default PaletteAccessRadio
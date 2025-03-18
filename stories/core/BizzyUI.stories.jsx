import React from 'react';
import { User, Settings, LogOut } from 'lucide-react';

// Import individual components to showcase
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel } from '../../bizzy/core/shared/ui/components/DropdownMenu';
import { Radio } from '../../bizzy/core/shared/ui/components/Radio';
import { RadioGroup } from '../../bizzy/core/shared/ui/components/RadioGroup';
import { Toggle } from '../../bizzy/core/shared/ui/components/Toggle';
import { Checkbox } from '../../bizzy/core/shared/ui/components/Checkbox';
import { Card, CardHeader, CardContent, CardFooter } from '../../bizzy/core/shared/ui/components/Card';
import { Button } from '../../bizzy/core/shared/ui/components/Button';
import { Input } from '../../bizzy/core/shared/ui/components/Input';

// Create a meta for the BizzyUI section
export default {
  title: 'BizzyUI/Components',
  parameters: {
    docs: {
      description: {
        component: 'BizzyPerson UI Components imported from the bizzy directory',
      },
    },
  },
};

// Simple showcase stories
export const DropdownMenuExample = {
  render: () => (
    <DropdownMenu title="Menu">
      <DropdownMenuItem>
        <User className="mr-2 h-4 w-4" />
        <span>Profile</span>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Settings className="mr-2 h-4 w-4" />
        <span>Settings</span>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem destructive>
        <LogOut className="mr-2 h-4 w-4" />
        <span>Logout</span>
      </DropdownMenuItem>
    </DropdownMenu>
  ),
  component: DropdownMenu
};

export const RadioExample = {
  render: () => (
    <RadioGroup name="example">
      <Radio value="option1" label="Option 1" />
      <Radio value="option2" label="Option 2" />
      <Radio value="option3" label="Option 3" />
    </RadioGroup>
  ),
  component: RadioGroup
};

export const ToggleExample = {
  render: () => (
    <Toggle label="Notifications" />
  ),
  component: Toggle
};

export const CheckboxExample = {
  render: () => (
    <Checkbox label="Remember me" />
  ),
  component: Checkbox
};

export const CardExample = {
  render: () => (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-medium">Card Title</h3>
      </CardHeader>
      <CardContent>
        <p>This is a sample card content.</p>
      </CardContent>
      <CardFooter>
        <Button variant="primary" size="sm">Action</Button>
      </CardFooter>
    </Card>
  ),
  component: Card
};

export const ButtonExample = {
  render: () => (
    <div className="flex gap-2">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
    </div>
  ),
  component: Button
};

export const InputExample = {
  render: () => (
    <Input label="Email" placeholder="Enter your email" />
  ),
  component: Input
}; 
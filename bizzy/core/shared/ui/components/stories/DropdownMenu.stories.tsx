import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { User, Settings, LogOut, HelpCircle, Mail, ChevronRight } from 'lucide-react';

import { 
  DropdownMenu, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuLabel 
} from '../DropdownMenu';
import { Button } from '../Button';

// Define some sample menu items to reuse
const menuItems = (
  <>
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
  </>
);

const meta = {
  title: 'Components/DropdownMenu',
  component: DropdownMenu,
  parameters: {
    docs: {
      description: {
        component: 'Dropdown menu component with multiple options, positioning, and customization. Follows the BizzyPerson design system.',
      },
    },
  },
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic example
export const Default: Story = {
  args: {
    title: 'Menu',
    children: menuItems,
  },
};

// Variant examples
export const Primary: Story = {
  args: {
    triggerVariant: 'primary',
    title: 'Primary Menu',
    children: menuItems,
  },
};

export const Secondary: Story = {
  args: {
    triggerVariant: 'secondary',
    title: 'Secondary Menu',
    children: menuItems,
  },
};

export const Outline: Story = {
  args: {
    triggerVariant: 'outline',
    title: 'Outline Menu',
    children: menuItems,
  },
};

export const Ghost: Story = {
  args: {
    triggerVariant: 'ghost',
    title: 'Ghost Menu',
    children: menuItems,
  },
};

// Size examples
export const Small: Story = {
  args: {
    triggerSize: 'sm',
    title: 'Small Menu',
    children: menuItems,
  },
};

export const Medium: Story = {
  args: {
    triggerSize: 'md',
    title: 'Medium Menu',
    children: menuItems,
  },
};

export const Large: Story = {
  args: {
    triggerSize: 'lg',
    title: 'Large Menu',
    children: menuItems,
  },
};

// Position examples
export const BottomLeft: Story = {
  args: {
    position: 'bottomLeft',
    title: 'Bottom Left',
    children: menuItems,
  },
};

export const BottomRight: Story = {
  args: {
    position: 'bottomRight',
    title: 'Bottom Right',
    children: menuItems,
  },
};

export const TopLeft: Story = {
  args: {
    position: 'topLeft',
    title: 'Top Left',
    children: menuItems,
  },
};

export const TopRight: Story = {
  args: {
    position: 'topRight',
    title: 'Top Right',
    children: menuItems,
  },
};

// Alignment examples
export const AlignStart: Story = {
  args: {
    align: 'start',
    title: 'Align Start',
    children: menuItems,
  },
};

export const AlignCenter: Story = {
  args: {
    align: 'center',
    title: 'Align Center',
    children: menuItems,
  },
};

export const AlignEnd: Story = {
  args: {
    align: 'end',
    title: 'Align End',
    children: menuItems,
  },
};

// With arrow example
export const WithArrow: Story = {
  args: {
    withArrow: true,
    title: 'With Arrow',
    children: menuItems,
  },
};

// Full width example
export const FullWidth: Story = {
  args: {
    fullWidth: true,
    title: 'Full Width Menu',
    children: menuItems,
  },
};

// Custom trigger example
export const CustomTrigger: Story = {
  args: {
    trigger: (
      <Button variant="primary" rightIcon={<ChevronRight />}>
        Custom Trigger
      </Button>
    ),
    children: menuItems,
  },
};

// With labels and sections
export const WithLabelsAndSections: Story = {
  args: {
    title: 'Menu with Sections',
    children: (
      <>
        <DropdownMenuLabel>User</DropdownMenuLabel>
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuLabel>Communication</DropdownMenuLabel>
        <DropdownMenuItem>
          <Mail className="mr-2 h-4 w-4" />
          <span>Messages</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <HelpCircle className="mr-2 h-4 w-4" />
          <span>Help</span>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem destructive>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </>
    ),
  },
};

// With inset items
export const WithInsetItems: Story = {
  args: {
    title: 'Inset Items',
    children: (
      <>
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuItem inset>Profile</DropdownMenuItem>
        <DropdownMenuItem inset>Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem inset destructive>Logout</DropdownMenuItem>
      </>
    ),
  },
};

// Controlled dropdown example
export const ControlledDropdown: Story = {
  render: function Render(args) {
    const [isOpen, setIsOpen] = React.useState(false);
    
    return (
      <div className="space-y-4">
        <div>
          <p className="mb-2">
            Dropdown is <strong>{isOpen ? 'open' : 'closed'}</strong>
          </p>
          <DropdownMenu
            {...args}
            title="Controlled Menu"
            open={isOpen}
            onOpenChange={setIsOpen}
          >
            {args.children}
          </DropdownMenu>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsOpen(true)}
          >
            Open
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsOpen(false)}
          >
            Close
          </Button>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={() => setIsOpen(!isOpen)}
          >
            Toggle
          </Button>
        </div>
      </div>
    );
  },
  args: {
    // Default args for the controlled dropdown
    children: menuItems,
  },
  parameters: {
    docs: {
      description: {
        story: 'An example of a controlled dropdown menu using React state.',
      },
    },
  },
};

// Multiple dropdowns showcase
export const DropdownShowcase: Story = {
  render: function Render(args) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-medium">Trigger Variants</h3>
          <div className="flex flex-wrap gap-4">
            <DropdownMenu {...args} triggerVariant="primary" title="Primary">
              {args.children}
            </DropdownMenu>
            <DropdownMenu {...args} triggerVariant="secondary" title="Secondary">
              {args.children}
            </DropdownMenu>
            <DropdownMenu {...args} triggerVariant="outline" title="Outline">
              {args.children}
            </DropdownMenu>
            <DropdownMenu {...args} triggerVariant="ghost" title="Ghost">
              {args.children}
            </DropdownMenu>
          </div>
        </div>
        
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-medium">Trigger Sizes</h3>
          <div className="flex flex-wrap gap-4 items-center">
            <DropdownMenu {...args} triggerSize="sm" title="Small">
              {args.children}
            </DropdownMenu>
            <DropdownMenu {...args} triggerSize="md" title="Medium">
              {args.children}
            </DropdownMenu>
            <DropdownMenu {...args} triggerSize="lg" title="Large">
              {args.children}
            </DropdownMenu>
          </div>
        </div>
        
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-medium">Positions</h3>
          <div className="flex flex-wrap gap-4">
            <DropdownMenu {...args} position="bottomLeft" title="Bottom Left">
              {args.children}
            </DropdownMenu>
            <DropdownMenu {...args} position="bottomRight" title="Bottom Right">
              {args.children}
            </DropdownMenu>
            <DropdownMenu {...args} position="topLeft" title="Top Left">
              {args.children}
            </DropdownMenu>
            <DropdownMenu {...args} position="topRight" title="Top Right">
              {args.children}
            </DropdownMenu>
          </div>
        </div>
        
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-medium">Special Options</h3>
          <div className="flex flex-wrap gap-4">
            <DropdownMenu {...args} withArrow title="With Arrow">
              {args.children}
            </DropdownMenu>
            <DropdownMenu
              {...args}
              trigger={
                <Button variant="primary" rightIcon={<ChevronRight />}>
                  Custom
                </Button>
              }
            >
              {args.children}
            </DropdownMenu>
          </div>
        </div>
      </div>
    );
  },
  args: {
    // Default args for the showcase
    children: menuItems,
  },
  parameters: {
    docs: {
      description: {
        story: 'A showcase of different dropdown menu variants and configurations.',
      },
    },
  },
}; 